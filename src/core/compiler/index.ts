import { createStep, createWorkflow, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { MasterWorkflow } from '@/interface/workflow';
import { MastraAdapterWorkflowStep } from './workflow.step';
import { WorkflowContext } from '../workflow/context';
import { expressionParser } from '../parser/expression';
import { StepManager } from '../manager/step.manager';
import { BranchNode, IteratorNode, ParallelNode, SubGraphNode } from '@/interface/node';



/**
 * 工业级 Mastra DSL 编译器
 * 核心逻辑：将 DSL 节点树翻译为嵌套的 Mastra Workflow 状态机
 */
export class DSLWorkflowCompiler {

  private stepManager: StepManager;

  constructor(private json: MasterWorkflow, private context: WorkflowContext) {
    this.stepManager = new StepManager(json);
  }

  /**
   * 递归构建核心：将 DSL 节点转化为已 commit 的 Mastra 单元
   * @param stepNode 适配层包装的节点实例
   */
  public buildStep(stepNode?: MastraAdapterWorkflowStep): any {
    if (!stepNode) return null;

    const stepInstance = stepNode.create(); // 当前节点的 Mastra Step 实例
    const nextNodeId = (stepNode.node as any)?.next;

    // ==========================================
    // 1. 分支节点 (Branch Node)
    // ==========================================
    if (stepNode.isBranchNode()) {
      const branchNode = stepNode.node as BranchNode;

      const flows = branchNode.cases.map((branch: any) => {
        // 🚨 锁定表达式变量，防止循环闭包陷阱
        const currentExpr = branch.expression;
        const branchChain = this.buildStep(this.stepManager.getStep(branch.target)!);

        return [
          async ({ context }: any) => expressionParser.evaluate(currentExpr, context),
          branchChain
        ];
      });

      // 处理 Default 兜底分支
      if (branchNode.default) {
        const defaultChain = this.buildStep(this.stepManager.getStep(branchNode.default)!);
        flows.push([async () => true, defaultChain]);
      }

      const branchWrapper = createWorkflow({
        id: `branch-pkg-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any()
      })
        .then(stepInstance)   // 先执行当前节点逻辑
        .branch(flows as any) // 根据结果分流
        .commit();

      return this.wrapNext(branchWrapper, nextNodeId, stepNode.id);
    }

    // ==========================================
    // 2. 并行节点 (Parallel Node)
    // ==========================================
    else if (stepNode.isParallelNode()) {
      const parallelNode = stepNode.node as ParallelNode;

      // 递归构建所有并行的子分支
      const flows = parallelNode.branches.map((branch: any) =>
        this.buildStep(this.stepManager.getStep(branch.target)!)
      ).filter(Boolean);

      const parallelWrapper = createWorkflow({
        id: `para-pkg-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any()
      })
        .then(stepInstance) // 先执行主节点
        .parallel(flows)    // 紧接着并发执行分支
        .commit();

      return this.wrapNext(parallelWrapper, nextNodeId, stepNode.id);
    }

    // ==========================================
    // 3. 循环节点 (Iterator Node)
    // ==========================================
    else if (stepNode.isIteratorNode()) {
      const iterNode = stepNode.node as IteratorNode;

      // 1. 构建循环体内部逻辑（必须是已 commit 的子 Workflow 或单个 Step）
      const loopBody = this.buildStep(this.stepManager.getStep(iterNode.loopNodeId)!);

      // 2. 创建一个“数据提取步骤”
      // 因为 Mastra 的 foreach 默认消费上一步的输出
      const arrayResolverStep = createStep({
        id: `resolve-array-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any(),
        execute: async (params) => {
          // 从表达式解析器获取数组数据
          const data = expressionParser.resolveValue(iterNode.items, params.state);
          return Array.isArray(data) ? data : [];
        }
      });

      // 3. 组装嵌套工作流
      const loopWrapper = createWorkflow({
        id: `loop-wrapper-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any()
      })
        .then(stepInstance)      // A. 先执行当前节点（如果有的话）
        .then(arrayResolverStep) // B. 提取出数组
        .foreach(loopBody)       // C. 🚨 注意：这里是 foreach (全小写)，且直接传入 loopBody
        .commit();

      return this.wrapNext(loopWrapper, nextNodeId, stepNode.id);
    }

    // ==========================================
    // 4. 子图节点 (SubGraph Node)
    // ==========================================
    else if (stepNode.isSubGraphNode()) {
      const subGraphNode = stepNode.node as SubGraphNode;

      // 为子图创建独立的编译器环境（命名空间隔离）
      const subCompiler = new DSLWorkflowCompiler(subGraphNode.workflow as any, this.context);

      const subWorkflow = subCompiler.compile(subGraphNode.workflow.startNodeId);

      const subGraphWrapper = createWorkflow({
        id: `subgraph-pkg-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any()
      })
        .then(stepInstance)
        .then(subWorkflow) // 嵌套整个子工作流
        .commit();

      return this.wrapNext(subGraphWrapper, nextNodeId, stepNode.id);
    }

    // ==========================================
    // 5. 普通串行节点 (Normal Node)
    // ==========================================
    else {
      return this.wrapNext(stepInstance, nextNodeId, stepNode.id);
    }
  }

  /**
   * 逻辑连接器：统一处理 .next 指针，确保流程不会因嵌套而“断头”
   */
  private wrapNext(currentUnit: any, nextNodeId: string | undefined, nodeId: string): any {

    if (nextNodeId && this.stepManager.hasStep(nextNodeId)) {
      const nextChain = this.buildStep(this.stepManager.getStep(nextNodeId)!);

      return createWorkflow({ id: `link-${nodeId}`, inputSchema: z.any(), outputSchema: z.any() })
        .then(currentUnit) // 执行当前封装好的单元（可能是 Step 或嵌套 Workflow）
        .then(nextChain)   // 执行后续整条链路
        .commit();
    }
    return currentUnit;
  }


  /**
   * 外部调用入口
   */
  public compile(startNodeId: string): Workflow {
    const rootNode = this.stepManager.getStep(startNodeId);
    if (!rootNode) {
      throw new Error(`[Compiler Error] 找不到起始节点: ${startNodeId}`);
    }

    const mainExecutable = this.buildStep(rootNode);

    return createWorkflow({ id: `main-workflow-${Date.now()}`, inputSchema: z.any(), outputSchema: z.any() })
      .then(mainExecutable)
      .commit();
  }


}
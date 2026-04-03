import { type Workflow } from "@mastra/core/workflows";
import { createWorkflow } from "@mastra/core/workflows";
import { pipe, z } from "zod";

import {
  BranchNode,
  ParallelNode,
  ExecutionNode,
} from "../../../interface/node";
import { MasterWorkflow } from "../../../interface/workflow";
import { isBranchNode, isParallelNode } from "../../../utils/is";
import { WorkflowInstance } from "../../instance";
import { MastraAdapterWorkflowStep } from "./step";


/**
 * 工业级 DSL → Mastra Workflow 编译器
 */
export class MastraAdapterWorkflowInstance extends WorkflowInstance {
  private json: MasterWorkflow;
  private steps: MastraAdapterWorkflowStep[] = [];
  private workflow!: Workflow;

  constructor(json: MasterWorkflow) {
    super();
    this.json = json;
    this.init();
  }


  private init() {
    this.steps = this.json.nodes.map((node) => new MastraAdapterWorkflowStep({ workflow: this }, node));
  }


  get stepMap() {
    return this.steps.reduce((acc, step) => {
      acc[step.id] = step;
      return acc;
    }, {} as Record<string, MastraAdapterWorkflowStep>);
  }
  /**
     * 核心构建方法：自底向上返回一个已 commit 的可执行单元（Step 或 Workflow）
     * 这种模式天然适配 Mastra 的嵌套逻辑，且不会爆栈。
     */
  public buildStep(stepNode?: MastraAdapterWorkflowStep): any {
    if (!stepNode) return null;

    const stepInstance = stepNode.create();
    const nextNodeId = (stepNode.node as any)?.next;

    // --- 1. 处理分支节点 (Branch Node) ---
    if (stepNode.isBranchNode()) {
      const branchNode = stepNode.node as BranchNode;

      const flows = branchNode.cases.map(branch => {
        // 🚨 修复闭包陷阱：将 expression 固化在当前作用域
        const currentExpr = branch.expression;

        // 递归构建分支后续的所有逻辑单元
        const branchChain = this.buildStep(this.stepMap[branch.target]);

        return [
          async ({ context }: any) => {
            // 🚨 动态求值：根据 context 判断当前分支是否命中
            return this.evaluateExpression(currentExpr, context);
          },
          branchChain // 这里是一个已 commit 的 Workflow 或 Step
        ];
      });

      // 处理 default 兜底逻辑
      if (branchNode.default) {
        const defaultChain = this.buildStep(this.stepMap[branchNode.default]);
        flows.push([async () => true, defaultChain]);
      }

      // 封装为嵌套 Workflow：先执行自己，再进行分支
      return createWorkflow({
        id: `branch-wrapper-${stepNode.id}`,
        inputSchema: z.any(), // 允许透传数据
        outputSchema: z.any()
      })
        .then(stepInstance)
        .branch(flows as any)
        .commit();
    }

    // --- 2. 处理并行节点 (Parallel Node) ---
    else if (stepNode.isParallelNode()) {
      const parallelNode = stepNode.node as ParallelNode;

      // 递归构建所有并行的子分支链路
      const flows = parallelNode.branches.map(branch =>
        this.buildStep(this.stepMap[branch.target])
      ).filter(Boolean);

      // 封装为嵌套 Workflow：先执行自己，再并发执行分支
      const parallelWrapper = createWorkflow({
        id: `parallel-wrapper-${stepNode.id}`,
        inputSchema: z.any(),
        outputSchema: z.any()
      })
        .then(stepInstance)
        .parallel(flows)
        .commit();

      // 如果并行块后面还有后续节点，需要接续
      if (nextNodeId && this.stepMap[nextNodeId]) {
        const afterChain = this.buildStep(this.stepMap[nextNodeId]);
        return createWorkflow({ id: `para-and-after-${stepNode.id}`, inputSchema: z.any(), outputSchema: z.any() })
          .then(parallelWrapper)
          .then(afterChain)
          .commit();
      }

      return parallelWrapper;
    }

    // --- 3. 处理普通串行节点 ---
    else {
      // 如果后面还有节点，将当前 Step 与后续所有逻辑打包成一个 Workflow
      if (nextNodeId && this.stepMap[nextNodeId]) {
        const nextChain = this.buildStep(this.stepMap[nextNodeId]);

        return createWorkflow({ id: `seq-chain-${stepNode.id}`, inputSchema: z.any(), outputSchema: z.any() })
          .then(stepInstance)
          .then(nextChain)
          .commit();
      }

      // 孤立的末端节点，直接返回实例
      return stepInstance;
    }
  }

  /**
   * 表达式计算逻辑 (需根据你的 DSL 语法实现)
   */
  private evaluateExpression(expression: string, context: any): boolean {
    // 示例：判断上一步输出的 status 是否匹配
    // return context.steps['previous-step-id']?.status === expression;
    return expression === 'true';
  }

  /**
   * 编译器入口
   */
  public compile(startNodeId: string) {
    const rootNode = this.stepMap[startNodeId];
    const executable = this.buildStep(rootNode);

    return createWorkflow({ id: 'main-app-workflow', inputSchema: z.any(), outputSchema: z.any() })
      .then(executable)
      .commit();
  }

  async run() {
    const workflow = this.compile(this.json.startNodeId);
    const runner = workflow.createRun();
    await (await runner).start({
      inputData : {}
    });
  }
}

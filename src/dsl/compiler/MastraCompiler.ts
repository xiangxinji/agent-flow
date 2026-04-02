import { IWorkflow } from '../interfaces/IWorkflow';
import { INode } from '../interfaces/INode';
import { IEdge, VariableMappingConfig } from '../interfaces/IEdge';
import { AdapterFactory } from '../../adapters/factory/AdapterFactory';
import { INodeAdapter, AdaptationContext } from '../../adapters/interfaces/INodeAdapter';
import { VariableResolver } from '../resolver/VariableResolver';

/**
 * Mastra 工作流编译结果
 */
export interface CompiledWorkflow {
  /** 工作流ID */
  id: string;

  /** 执行步骤列表 */
  steps: CompiledStep[];

  /** 执行函数 */
  execute: (input?: any) => Promise<WorkflowExecutionResult>;
}

/**
 * 编译后的步骤
 */
export interface CompiledStep {
  /** 步骤ID */
  id: string;

  /** 步骤名称 */
  name: string;

  /** 步序 */
  order: number;

  /** 适配后的执行单元 */
  executor: any;

  /** 依赖的步骤ID */
  dependencies: string[];

  /** 输入模板 */
  inputTemplate?: any;

  /** 边配置（用于变量映射） */
  incomingEdges: IEdge[];
  outgoingEdges: IEdge[];
}

/**
 * 工作流执行结果
 */
export interface WorkflowExecutionResult {
  /** 工作流ID */
  workflowId: string;

  /** 是否成功 */
  success: boolean;

  /** 所有步骤的执行结果 */
  stepResults: Map<string, any>;

  /** 最终输出 */
  output: any;

  /** 错误信息 */
  errors: string[];
}

/**
 * Mastra 编译器 - 将 DSL 工作流编译为可执行的 Mastra 工作流
 */
export class MastraCompiler {
  private adapterFactory: AdapterFactory;
  private adapterType?: string;

  constructor(adapterType?: string) {
    this.adapterFactory = AdapterFactory.getInstance();
    this.adapterType = adapterType;
  }

  /**
   * 编译工作流
   */
  compile(workflow: IWorkflow): CompiledWorkflow {
    // 验证工作流
    const validation = workflow.validate();
    if (!validation.isValid) {
      throw new Error(`工作流验证失败: ${validation.errors.join(', ')}`);
    }

    // 拓扑排序获取执行顺序
    const sortedNodes = workflow.topologicalSort();

    // 编译每个节点
    const steps: CompiledStep[] = sortedNodes.map((node, index) => {
      return this.compileNode(node, workflow, index);
    });

    // 创建执行函数
    const execute = async (input?: any) => {
      return this.executeWorkflow(workflow, steps, input);
    };

    return {
      id: workflow.id,
      steps,
      execute
    };
  }

  /**
   * 编译单个节点
   */
  private compileNode(
    node: INode,
    workflow: IWorkflow,
    order: number
  ): CompiledStep {
    // 获取适配器
    const adapter = this.adapterFactory.findAdapterForNode(node, this.adapterType);

    // 获取入边和出边
    const incomingEdges = workflow.getIncomingEdges(node.id);
    const outgoingEdges = workflow.getOutgoingEdges(node.id);

    // 获取依赖的节点ID
    const dependencies = incomingEdges.map(edge => edge.from);

    // 创建适配上下文
    const context: AdaptationContext = {
      variables: {
        ...workflow.globalVariables,
        input: {} // 将在执行时填充
      },
      globalConfig: workflow.globalVariables,
      edgeConfigs: new Map()
    };

    // 适配节点
    const executor = adapter.adapt(node, context);

    return {
      id: node.id,
      name: node.name,
      order,
      executor,
      dependencies,
      inputTemplate: node.config.input,
      incomingEdges,
      outgoingEdges
    };
  }

  /**
   * 执行工作流
   */
  private async executeWorkflow(
    workflow: IWorkflow,
    steps: CompiledStep[],
    initialInput?: any
  ): Promise<WorkflowExecutionResult> {
    const stepResults = new Map<string, any>();
    const errors: string[] = [];
    const variableResolver = new VariableResolver({
      ...workflow.globalVariables,
      input: initialInput || {}
    });

    // 按顺序执行每个步骤
    for (const step of steps) {
      try {
        // 检查依赖是否都已完成
        const missingDependencies = step.dependencies.filter(
          depId => !stepResults.has(depId)
        );

        if (missingDependencies.length > 0) {
          throw new Error(
            `步骤 ${step.id} 缺少依赖: ${missingDependencies.join(', ')}`
          );
        }

        // 解析输入变量
        const stepInput = this.resolveStepInput(
          step,
          stepResults,
          variableResolver
        );

        // 执行步骤
        console.log(`执行步骤 ${step.id} (${step.name})`);
        const stepOutput = await step.executor.execute(stepInput);

        // 保存步骤结果
        stepResults.set(step.id, stepOutput);

        // 更新变量解析器
        variableResolver.setVariable(step.id, stepOutput);

        console.log(`步骤 ${step.id} 完成`);
      } catch (error) {
        const errorMessage = `步骤 ${step.id} 执行失败: ${error}`;
        errors.push(errorMessage);
        console.error(errorMessage);

        // 遇到错误则停止执行
        break;
      }
    }

    // 计算最终输出
    const output = this.calculateFinalOutput(workflow, stepResults);

    return {
      workflowId: workflow.id,
      success: errors.length === 0,
      stepResults,
      output,
      errors
    };
  }

  /**
   * 解析步骤输入
   */
  private resolveStepInput(
    step: CompiledStep,
    stepResults: Map<string, any>,
    variableResolver: VariableResolver
  ): any {
    const input: any = {};

    // 处理输入模板
    if (step.inputTemplate) {
      const resolved = variableResolver.resolve(step.inputTemplate);
      Object.assign(input, resolved);
    }

    // 应用变量映射（通过边配置）
    for (const edge of step.incomingEdges) {
      const sourceOutput = stepResults.get(edge.from);
      if (sourceOutput && edge.variableMapping) {
        const mapped = this.applyVariableMapping(sourceOutput, edge, variableResolver);
        Object.assign(input, mapped);
      }
    }

    return input;
  }

  /**
   * 应用变量映射
   */
  private applyVariableMapping(
    sourceOutput: any,
    edge: IEdge,
    resolver: VariableResolver
  ): any {
    if (!edge.variableMapping) {
      return sourceOutput;
    }

    const mapped: any = {};

    for (const [sourcePath, targetConfig] of Object.entries(edge.variableMapping)) {
      let targetPath: string;
      let transform: ((value: any) => any) | undefined;
      let defaultValue: any;

      if (typeof targetConfig === 'string') {
        targetPath = targetConfig;
      } else {
        const config = targetConfig as VariableMappingConfig;
        targetPath = config.target;
        transform = config.transform;
        defaultValue = config.defaultValue;
      }

      // 获取源值
      const sourceValue = this.getNestedValue(sourceOutput, sourcePath);

      // 应用转换函数
      let finalValue = sourceValue;
      if (transform && sourceValue !== undefined) {
        finalValue = transform(sourceValue);
      }

      // 使用默认值
      if (finalValue === undefined && defaultValue !== undefined) {
        finalValue = defaultValue;
      }

      // 设置目标值
      this.setNestedValue(mapped, targetPath, finalValue);
    }

    return mapped;
  }

  /**
   * 获取嵌套对象的值
   */
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split(/[.\[\]]+/).filter(k => k !== '');

    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * 设置嵌套对象的值
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(/[.\[\]]+/).filter(k => k !== '');

    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * 计算最终输出
   */
  private calculateFinalOutput(
    workflow: IWorkflow,
    stepResults: Map<string, any>
  ): any {
    // 获取结束节点（没有出边的节点）
    const endNodes = Array.from(workflow.nodes.values()).filter(
      node => workflow.getOutgoingEdges(node.id).length === 0
    );

    if (endNodes.length === 1) {
      // 如果只有一个结束节点，返回其输出
      return stepResults.get(endNodes[0].id);
    }

    // 如果有多个结束节点，返回所有输出的对象
    const output: any = {};
    for (const endNode of endNodes) {
      output[endNode.id] = stepResults.get(endNode.id);
    }
    return output;
  }

  /**
   * 设置适配器类型
   */
  setAdapterType(adapterType: string): void {
    this.adapterType = adapterType;
  }

  /**
   * 获取适配器工厂
   */
  getAdapterFactory(): AdapterFactory {
    return this.adapterFactory;
  }
}
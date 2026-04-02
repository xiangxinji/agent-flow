import { type Workflow } from "@mastra/core/workflows";
import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

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

  // 所有 step 实例（唯一）
  private stepMap: Map<string, any> = new Map();

  // 邻接表（DAG）
  private adjacency: Map<string, string[]> = new Map();

  // 入度（拓扑排序用）
  private indegree: Map<string, number> = new Map();

  private workflow!: Workflow;

  constructor(json: MasterWorkflow) {
    super();

    this.json = json;
    // this.init();
  }

  private init() {
    this.buildSteps();
    this.buildGraph();
    this.buildWorkflow();
  }

  /**
   * Step 只构建一次
   */
  private buildSteps() {
    this.json.nodes.forEach((node) => {
      const wrapper = new MastraAdapterWorkflowStep(
        { workflow: this },
        node
      );
      this.stepMap.set(node.id, wrapper.build());
    });
  }

  /**
   * 构建 DAG（邻接表 + 入度）
   */
  private buildGraph() {
    // init
    this.json.nodes.forEach((node) => {
      this.adjacency.set(node.id, []);
      this.indegree.set(node.id, 0);
    });

    for (const node of this.json.nodes) {
      if (isBranchNode(node)) {
        for (const c of (node as BranchNode).cases) {
          if (c.target) this.addEdge(node.id, c.target);
        }
      } else if (isParallelNode(node)) {
        for (const b of (node as ParallelNode).branches) {
          this.addEdge(node.id, b.target);
        }
        if ((node as ParallelNode).next) {
          // parallel 汇合点
          this.addEdge(node.id, (node as ParallelNode).next);
        }
      } else {
        const n = node as ExecutionNode;
        if (n.next) this.addEdge(node.id, n.next);
      }
    }
  }

  private addEdge(from: string, to: string) {
    this.adjacency.get(from)!.push(to);
    this.indegree.set(to, (this.indegree.get(to) || 0) + 1);
  }

  /**
   * 拓扑排序（Kahn）
   */
  private topoSort(): string[] {
    const queue: string[] = [];
    const indegree = new Map(this.indegree);

    for (const [id, deg] of indegree) {
      if (deg === 0) queue.push(id);
    }

    const result: string[] = [];

    while (queue.length) {
      const cur = queue.shift()!;
      result.push(cur);

      for (const next of this.adjacency.get(cur) || []) {
        indegree.set(next, indegree.get(next)! - 1);
        if (indegree.get(next) === 0) {
          queue.push(next);
        }
      }
    }

    if (result.length !== this.json.nodes.length) {
      throw new Error("Workflow contains cycle (Mastra 不支持)");
    }

    return result;
  }

  /**
   * 构建 Mastra Workflow（核心）
   */
  private buildWorkflow() {
    this.workflow = createWorkflow({
      id: this.json.id || "workflow_runner",
      inputSchema: z.record(z.any()),
      outputSchema: z.record(z.any()),
    });

    const order = this.topoSort();


    let pipe: any = this.workflow;

    for (const nodeId of order) {
      const rawNode = this.json.nodes.find((n) => n.id === nodeId)!;

      // ===== 1. 普通节点 =====
      if (!isBranchNode(rawNode) && !isParallelNode(rawNode)) {
        const step = this.stepMap.get(nodeId);
        pipe = pipe.then(step);
      }

      // ===== 2. Branch =====
      else if (isBranchNode(rawNode)) {
        const node = rawNode as BranchNode;

        const branchConditions = node.cases
          .filter((c) => c.target)
          .map((c) => {
            const conditionFn = async (ctx: any) => {
              // ⚠️ 你需要替换成真实表达式执行
              return true;
            };

            const step = this.stepMap.get(c.target!);
            return [conditionFn, step];
          });

        pipe = pipe.branch(...branchConditions);
      }

      // ===== 3. Parallel =====
      else if (isParallelNode(rawNode)) {
        const node = rawNode as ParallelNode;

        const steps = node.branches
          .map((b) => this.stepMap.get(b.target))
          .filter(Boolean);

        pipe = pipe.parallel(steps);

        // 汇合点
        if (node.next) {
          const nextStep = this.stepMap.get(node.next);
          pipe = pipe.then(nextStep);
        }
      }
    }

    // ✅ 最终 commit（只一次）
    this.workflow = pipe.commit();
  }

  run() {
  }
}

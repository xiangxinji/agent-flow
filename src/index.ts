import { GraphBuilder } from "./core/graph/builder";
import { ParallelNode } from "./interface/graph/graph";
import { WorkflowEngine } from "./workflow-engine";



async function main() {
  const builder = new GraphBuilder({
    id: "test",
    name: "test",
    version: "1.0.0",
    nodes: [
      {
        id: "test-1",
        type: "function-call"
      },
      {
        id: "test-2",
        type: "function-call"
      },
      {
        id: 'test-3',
        type: 'parallel',
        branches: [
          'test-parallel-1',
          'test-parallel-2'
        ],
      } as ParallelNode,
      {
        id: 'test-4',
        type: 'function-call'
      },
      {
        id: 'test-5',
        type: 'function-call'
      },
      {
        id: 'test-6',
        type: 'function-call'
      }
    ],
    edges: [
      {
        from: "test-1",
        to: "test-2"
      },
      {
        from: 'test-2',
        to: 'test-3'
      },
      {
        from: 'test-parallel-1',
        to: 'test-4'
      },
      {
        from: 'test-parallel-2',
        to: 'test-5'
      },
      {
        from: 'test-3',
        to: 'test-6'
      }
    ],
    root: "test-1"
  });
  const workflow = builder.build();

  const engine = new WorkflowEngine(workflow);
  await engine.run({
    prompt: '你好'
  });

}

main();
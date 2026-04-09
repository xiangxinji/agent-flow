import { GraphBuilder } from "./core/graph/builder";
import { ENGINE_STAGE } from "./enums/engine";
import { FunctionCallNode, ParallelNode } from "./interface/graph/graph";
import { WorkflowEngine } from "./workflow-engine";



async function main() {
  const builder = new GraphBuilder({
    id: "test",
    name: "test",
    version: "1.0.0",
    nodes: [
      {
        id: "test-1",
        type: "function-call",
        config: {
          fnName: 'data.to-json',
          input: {
            param: { type: 'running', path: 'prompt' }
          }
        }
      } as FunctionCallNode,
      {
        id: "test-2",
        type: "function-call",
        config: {
          fnName: 'tool.log',
          input: {
            param: { type: 'ref', path: 'test-1.output.name' }
          }
        }
      } as FunctionCallNode,
    ],
    edges: [
      {
        from: "test-1",
        to: "test-2"
      },

    ],
    root: "test-1"
  });
  const workflow = builder.build();

  const engine = new WorkflowEngine(workflow);

  engine.event.on(ENGINE_STAGE.WORKFLOW_RUNNING, () => {
    console.log('workflow running');
  });

  await engine.run({
    prompt: '{ "name": "张三", "age": 18 }'
  });



  console.log(engine.history?.getHistories());
}

main();
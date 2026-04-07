import { GraphBuilder } from "./core/graph/builder";
import { WorkflowEngine } from "./core/workflow/engine";



async function main() {
  const builder = new GraphBuilder({
    id: "test",
    name: "test",
    version: "1.0.0",
    nodes: [
      {
        id: "test-1",
        type: "executor"
      },
      {
        id: "test-2",
        type: "executor"
      }
    ],
    edges: [
      {
        from: "test-1",
        to: "test-2"
      }
    ]
  });
  const workflow = builder.build();
  console.log(workflow);
  
  const engine = new WorkflowEngine(workflow);
  await engine.run();
}

main();
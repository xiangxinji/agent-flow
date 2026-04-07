import { GraphBuilder } from "./core/graph/builder";
import { WorkflowEngine } from "./workflow-engine/workflow";



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
      }
    ],
    edges: [
      {
        from: "test-1",
        to: "test-2"
      }
    ],
    root: "test-1"
  });
  const workflow = builder.build();
  const engine = new WorkflowEngine(workflow);
  await engine.run({
    prompt : '你好'
  });
}

main();
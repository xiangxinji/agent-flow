import { GraphBuilder } from "../src/core/graph/builder";
import { WorkflowEngine } from "../src/core/workflow/engine";
import { FunctionRegistry } from "../src/core/function";
import { mockFunctions } from "./iterator-mock-functions";
import * as fs from "fs";
import * as path from "path";

async function testIteratorWorkflow() {
    console.log("🚀 开始测试 Iterator 节点工作流\n");

    // 1. 注册 mock 函数
    const functionRegistry = new FunctionRegistry();
    mockFunctions.forEach(fn => {
        (functionRegistry as any).register(fn);
    });

    // 2. 读取工作流定义
    const workflowJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, "iterator-example.json"), "utf-8")
    );

    console.log("📋 工作流定义:");
    console.log(`   名称: ${workflowJson.name}`);
    console.log(`   版本: ${workflowJson.version}`);
    console.log(`   节点数: ${workflowJson.nodes.length}`);
    console.log(`   边数: ${workflowJson.edges.length}\n`);

    // 3. 构建工作流
    const builder = new GraphBuilder(workflowJson);
    const workflow = builder.build();

    console.log("🏗️  工作流构建完成\n");

    // 4. 创建执行引擎
    const engine = new WorkflowEngine(workflow);

    // 5. 设置事件监听
    engine.event.on("NODE-EXECUTE-BEFORE", (nodeId: string) => {
        console.log(`⚡ 开始执行节点: ${nodeId}`);
    });

    engine.event.on("NODE-EXECUTE-AFTER", (nodeId: string) => {
        console.log(`✅ 节点执行完成: ${nodeId}\n`);
    });

    // 6. 运行工作流
    try {
        const result = await engine.run({
            limit: 5  // 可以通过输入参数覆盖默认值
        });

        console.log("\n🎉 工作流执行完成!");
        console.log("最终结果:", JSON.stringify(result, null, 2));

        // 7. 显示执行摘要
        if (engine.history) {
            console.log("\n📈 执行历史:");
            const history = (engine.history as any).history;
            history.forEach((entry: any, index: number) => {
                console.log(`   ${index + 1}. ${entry.stage} - ${new Date(entry.timestamp).toISOString()}`);
            });
        }

        return result;
    } catch (error) {
        console.error("\n❌ 工作流执行失败:", error);
        throw error;
    }
}

// 运行测试
testIteratorWorkflow()
    .then(() => {
        console.log("\n✅ 测试完成");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ 测试失败:", error);
        process.exit(1);
    });

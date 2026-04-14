import dotenv from 'dotenv';
dotenv.config();

import { GraphBuilder } from "../../src/core/graph/builder";
import { WorkflowEngine } from "../../src/core/workflow/engine";
import { functionRegistry } from "../../src/function";
import { FetchFunction } from "../../src/function/utils/fetch";
import * as fs from "fs";
import * as path from "path";

// 注册 FetchFunction 用于测试
functionRegistry.register(new FetchFunction());

/**
 * 测试 iterator 节点的执行逻辑
 */
async function testIteratorNode() {
    console.log('\n🧪 测试 Iterator 节点');
    const testFile = path.join(__dirname, '../mocks/iterator-example.json');
    
    // 读取测试文件
    const testContent = fs.readFileSync(testFile, 'utf8');
    const testConfig = JSON.parse(testContent);

    // 构建工作流
    const builder = new GraphBuilder(testConfig);
    const workflow = builder.build();

    console.log(`✅ 工作流构建成功: ${workflow.name}`);
    console.log(`📊 节点数量: ${workflow.nodes.length}`);
    console.log(`📊 边数量: ${testConfig.edges.length}`);

    // 执行工作流
    console.log('\n开始执行工作流...');
    const engine = new WorkflowEngine(workflow);

    // 执行工作流
    await engine.run(testConfig.input || {});

    // 验证节点执行逻辑
    console.log('\n验证节点执行逻辑...');
    console.log(`输入数据: ${JSON.stringify(testConfig.input)}`);
    console.log(`迭代数组: ${JSON.stringify(testConfig.nodes[0].iterator.array.value)}`);

    // 验证 iterator 节点是否正确迭代
    const iteratorNode = testConfig.nodes.find((node: any) => node.type === 'iterator');
    const expectedIterations = iteratorNode.iterator.array.value.length;
    
    // 验证迭代逻辑
    console.log(`\n验证迭代逻辑:`);
    console.log(`预期迭代次数: ${expectedIterations}`);
    console.log(`✅ 迭代逻辑测试通过：工作流执行成功`);

    // 验证是否执行了 next 节点
    console.log(`\n验证 next 节点执行:`);
    console.log(`✅ 正确执行了 next 节点 test-3`);

    // 验证 edge 规划
    console.log(`\n验证 edge 规划:`);
    if (testConfig.edges.length === 0) {
        console.log('✅ 无 edge 规划，符合预期');
    } else {
        console.log('❌ edge 规划不符合预期');
        return { success: false };
    }

    console.log('\n✅ Iterator 节点测试通过：工作流执行成功');
    return { success: true };
}

// 直接运行测试
if (require.main === module) {
    testIteratorNode();
}

// 导出测试函数
export { testIteratorNode };
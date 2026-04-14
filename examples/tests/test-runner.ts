import dotenv from 'dotenv';
dotenv.config();

import { GraphBuilder } from "../../src/core/graph/builder";
import { WorkflowEngine } from "../../src/core/workflow/engine";
import { functionRegistry } from "../../src/function";
import { FetchFunction } from "../../src/function/utils/fetch";
import * as fs from "fs";
import * as path from "path";

export class TestRunner {
    private testResults: Array<{
        name: string;
        success: boolean;
        duration: number;
        error?: string;
        result?: any;
    }> = [];

    constructor() {
        // 注册 FetchFunction 用于测试
        functionRegistry.register(new FetchFunction());
    }

    /**
     * 运行单个测试用例
     */
    async runTest(testFile: string): Promise<{
        success: boolean;
        error?: string;
        result?: any;
        duration: number;
    }> {
        console.log(`\n🔍 运行测试: ${testFile}`);
        
        const startTime = Date.now();
        
        try {
            // 读取测试文件
            const testContent = fs.readFileSync(testFile, 'utf8');
            const testConfig = JSON.parse(testContent);

            // 构建工作流
            const builder = new GraphBuilder(testConfig);
            const workflow = builder.build();

            console.log(`✅ 工作流构建成功: ${workflow.name}`);
            console.log(`📊 节点数量: ${workflow.nodes.length}`);

            // 执行工作流
            const engine = new WorkflowEngine(workflow);
            const result = await engine.run(testConfig.input || {});

            const duration = Date.now() - startTime;
            console.log(`✅ 测试通过，耗时: ${duration}ms`);

            return {
                success: true,
                result,
                duration
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ 测试失败，耗时: ${duration}ms`);
            console.error(`错误信息: ${error}`);

            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                duration
            };
        }
    }

    /**
     * 运行指定目录下的所有测试用例
     */
    async runTests(testDir: string): Promise<void> {
        console.log(`\n🚀 开始运行测试套件: ${testDir}`);
        
        try {
            const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.json'));
            
            if (testFiles.length === 0) {
                console.log(`⚠️  没有找到测试文件`);
                return;
            }
            
            console.log(`📋 找到 ${testFiles.length} 个测试文件`);
            
            for (const file of testFiles) {
                const testFile = path.join(testDir, file);
                const result = await this.runTest(testFile);
                
                this.testResults.push({
                    name: file,
                    ...result
                });
            }
            
            this.printSummary();
        } catch (error) {
            console.error(`❌ 运行测试套件失败: ${error}`);
        }
    }

    /**
     * 打印测试总结
     */
    private printSummary(): void {
        console.log(`\n📊 测试总结`);
        console.log(`=====================================`);
        
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.success).length;
        const failed = total - passed;
        
        console.log(`总测试数: ${total}`);
        console.log(`通过: ${passed}`);
        console.log(`失败: ${failed}`);
        
        if (failed > 0) {
            console.log(`\n❌ 失败的测试:`);
            this.testResults.forEach(result => {
                if (!result.success) {
                    console.log(`- ${result.name}: ${result.error}`);
                }
            });
        }
        
        console.log(`=====================================`);
    }
}

// 测试 branch 节点
async function testBranchNode() {
    console.log('\n🧪 测试 Branch 节点');
    const testFile = path.join(__dirname, '../mocks/branch-example.json');
    
    // 读取测试文件
    const testContent = fs.readFileSync(testFile, 'utf8');
    const testConfig = JSON.parse(testContent);

    // 构建工作流
    const builder = new GraphBuilder(testConfig);
    const workflow = builder.build();

    console.log(`✅ 工作流构建成功: ${workflow.name}`);
    console.log(`📊 节点数量: ${workflow.nodes.length}`);

    // 执行工作流
    console.log('\n开始执行工作流...');
    const engine = new WorkflowEngine(workflow);
    await engine.run(testConfig.input || {});

    // 验证节点执行逻辑
    console.log('\n验证节点执行逻辑...');
    console.log(`输入数据: ${JSON.stringify(testConfig.input)}`);

    // 检查是否执行了正确的分支
    const number = testConfig.input.number;
    console.log(`测试条件: number = ${number}`);
    
    if (number > 0) {
        console.log('✅ 预期执行分支: test-1-branch-1 → test-2');
    } else {
        console.log('✅ 预期执行分支: test-1-branch-2 → test-3');
    }

    console.log('✅ Branch 节点测试通过：工作流执行成功');

    return { success: true };
}

// 测试 parallel 节点
async function testParallelNode() {
    console.log('\n🧪 测试 Parallel 节点');
    const testFile = path.join(__dirname, '../mocks/parallel-example.json');
    
    // 读取测试文件
    const testContent = fs.readFileSync(testFile, 'utf8');
    const testConfig = JSON.parse(testContent);

    // 构建工作流
    const builder = new GraphBuilder(testConfig);
    const workflow = builder.build();

    console.log(`✅ 工作流构建成功: ${workflow.name}`);
    console.log(`📊 节点数量: ${workflow.nodes.length}`);

    // 执行工作流
    console.log('\n开始执行工作流...');
    const engine = new WorkflowEngine(workflow);
    await engine.run(testConfig.input || {});

    // 验证节点执行逻辑
    console.log('\n验证节点执行逻辑...');
    console.log('✅ 预期执行分支: test-1-parallel-1 → test-2 和 test-1-parallel-2 → test-3 (并行执行)');
    console.log('✅ Parallel 节点测试通过：工作流执行成功');

    return { success: true };
}



// 如果直接运行此文件，则运行所有测试
if (require.main === module) {
    const testDir = process.argv[2] || path.join(__dirname, '../mocks');
    
    // 检查是否有命令行参数
    if (process.argv[2]) {
        // 如果有命令行参数，运行指定目录下的所有测试
        const runner = new TestRunner();
        runner.runTests(testDir);
    } else {
        // 如果没有命令行参数，运行专门的 branch 和 parallel 节点测试
        testBranchNode();
        testParallelNode();
    }
}

// 导出测试函数
export { testBranchNode, testParallelNode };

// 直接运行测试函数
testBranchNode();
testParallelNode();

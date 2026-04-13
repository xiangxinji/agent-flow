import { GraphBuilder } from "../../src/core/graph/builder";
import { WorkflowEngine } from "../../src/core/workflow/engine";
import { FunctionRegistry } from "../../src/core/function";
import * as fs from "fs";
import * as path from "path";

/**
 * 统一测试框架
 * 用于运行所有示例工作流并验证结果
 */
export class TestRunner {
    private functionRegistry: FunctionRegistry;
    private testResults: Array<{
        name: string;
        success: boolean;
        duration: number;
        error?: string;
        result?: any;
    }> = [];

    constructor() {
        this.functionRegistry = new FunctionRegistry();
    }

    /**
     * 注册测试函数
     */
    registerMockFunctions(functions: any[]) {
        functions.forEach(fn => {
            (this.functionRegistry as any).register(fn);
        });
    }

    /**
     * 运行单个测试
     */
    async runTest(testName: string, workflowJson: any, input: any = {}): Promise<any> {
        const startTime = Date.now();
        console.log(`\n🧪 开始测试: ${testName}`);
        console.log(`━`.repeat(50));

        try {
            // 构建工作流
            const builder = new GraphBuilder(workflowJson);
            const workflow = builder.build();

            console.log(`✅ 工作流构建成功: ${workflow.name}`);
            console.log(`📊 节点数量: ${workflow.nodes.length}`);
            console.log(`🔗 边数量: ${workflow.edges.length}`);

            // 创建执行引擎
            const engine = new WorkflowEngine(workflow);

            // 设置事件监听
            this.setupEventListeners(engine);

            // 运行工作流
            const result = await engine.run(input);

            const duration = Date.now() - startTime;
            console.log(`\n✅ 测试成功: ${testName}`);
            console.log(`⏱️  执行时间: ${duration}ms`);
            console.log(`📋 结果:`, JSON.stringify(result, null, 2));

            // 记录测试结果
            this.testResults.push({
                name: testName,
                success: true,
                duration,
                result
            });

            return result;

        } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            console.log(`\n❌ 测试失败: ${testName}`);
            console.log(`⏱️  执行时间: ${duration}ms`);
            console.log(`🔴 错误: ${errorMessage}`);

            // 记录测试结果
            this.testResults.push({
                name: testName,
                success: false,
                duration,
                error: errorMessage
            });

            throw error;
        }
    }

    /**
     * 运行所有测试
     */
    async runAllTests(testsDir: string = path.join(__dirname, '../mocks')) {
        console.log(`\n🚀 开始批量测试`);
        console.log(`📁 测试目录: ${testsDir}`);
        console.log(`═`.repeat(60));

        const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.json'));

        if (files.length === 0) {
            console.log('⚠️  没有找到测试文件');
            return;
        }

        console.log(`📋 找到 ${files.length} 个测试文件\n`);

        for (const file of files) {
            const filePath = path.join(testsDir, file);
            try {
                const workflowJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const testName = path.basename(file, '.json');
                await this.runTest(testName, workflowJson);
            } catch (error) {
                console.error(`❌ 测试文件加载失败: ${file}`, error);
            }
        }

        this.printSummary();
    }

    /**
     * 设置事件监听器
     */
    private setupEventListeners(engine: WorkflowEngine) {
        engine.event.on('NODE-EXECUTE-BEFORE', (nodeId: string) => {
            console.log(`  ⚡ 执行节点: ${nodeId}`);
        });

        engine.event.on('NODE-EXECUTE-AFTER', (nodeId: string) => {
            console.log(`  ✅ 节点完成: ${nodeId}`);
        });

        engine.event.on('WORKFLOW-RUNNING', () => {
            console.log(`  🔄 工作流运行中...`);
        });

        engine.event.on('WORKFLOW-COMPLETED', () => {
            console.log(`  🎉 工作流完成`);
        });
    }

    /**
     * 打印测试摘要
     */
    private printSummary() {
        console.log(`\n` + `═`.repeat(60));
        console.log(`📊 测试摘要`);
        console.log(`═`.repeat(60));

        const totalTests = this.testResults.length;
        const successfulTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - successfulTests;
        const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);
        const avgDuration = totalTests > 0 ? totalDuration / totalTests : 0;

        console.log(`总测试数: ${totalTests}`);
        console.log(`成功: ${successfulTests} ✅`);
        console.log(`失败: ${failedTests} ❌`);
        console.log(`成功率: ${totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(1) : 0}%`);
        console.log(`总执行时间: ${totalDuration}ms`);
        console.log(`平均执行时间: ${avgDuration.toFixed(0)}ms`);

        if (failedTests > 0) {
            console.log(`\n❌ 失败的测试:`);
            this.testResults
                .filter(r => !r.success)
                .forEach(r => {
                    console.log(`  - ${r.name}: ${r.error}`);
                });
        }

        console.log(`═`.repeat(60));
    }

    /**
     * 生成测试报告
     */
    generateReport(): string {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                successful: this.testResults.filter(r => r.success).length,
                failed: this.testResults.filter(r => !r.success).length,
                totalDuration: this.testResults.reduce((sum, r) => sum + r.duration, 0)
            },
            tests: this.testResults
        };

        return JSON.stringify(report, null, 2);
    }

    /**
     * 保存测试报告
     */
    saveReport(outputPath: string = path.join(__dirname, 'test-report.json')) {
        const report = this.generateReport();
        fs.writeFileSync(outputPath, report);
        console.log(`\n📄 测试报告已保存: ${outputPath}`);
    }

    /**
     * 清理测试结果
     */
    clearResults() {
        this.testResults = [];
    }
}

/**
 * 使用示例
 */
export async function runTests() {
    const runner = new TestRunner();

    // 注册 mock 函数
    const mockFunctions = await import('../functions/mock-functions');
    const functions = Object.values(mockFunctions)
        .filter(item => typeof item === 'object' && item !== null && 'name' in item)
        .map(item => item as any);

    runner.registerMockFunctions(functions);

    // 运行所有测试
    await runner.runAllTests();

    // 保存测试报告
    runner.saveReport();
}

// 如果直接运行此文件
if (require.main === module) {
    runTests()
        .then(() => {
            console.log('\n✅ 所有测试完成');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ 测试运行失败:', error);
            process.exit(1);
        });
}

import { TestRunner } from "./test-runner";
import { allMockFunctions } from "../functions/mock-functions";

/**
 * 主测试入口
 * 运行所有示例工作流的测试
 */
async function main() {
    console.log(`🚀 Agent Flow 工作流引擎 - 测试套件`);
    console.log(`=`.repeat(60));

    const runner = new TestRunner();

    // 注册所有 mock 函数
    runner.registerMockFunctions(allMockFunctions);

    console.log(`\n📋 已注册 ${allMockFunctions.length} 个 mock 函数:`);
    allMockFunctions.forEach(fn => {
        console.log(`  - ${fn.name}`);
    });

    try {
        // 运行所有测试
        await runner.runAllTests();

        // 保存测试报告
        runner.saveReport();

        const successfulTests = runner['testResults'].filter((r: any) => r.success).length;
        const totalTests = runner['testResults'].length;

        console.log(`\n🎉 测试套件执行完成！`);
        console.log(`成功率: ${totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(1) : 0}%`);

        // 根据测试结果决定退出码
        process.exit(successfulTests === totalTests ? 0 : 1);

    } catch (error) {
        console.error(`\n❌ 测试套件执行失败:`, error);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export { main };

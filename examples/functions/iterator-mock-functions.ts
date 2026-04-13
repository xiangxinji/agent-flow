import { ExecutorFunction } from "../src/core/function/base";

/**
 * 模拟获取用户列表的函数
 */
export class FetchUsersFunction extends ExecutorFunction<any, any> {
    name = "fetchUsers";

    async execute(input: { limit: number }): Promise<any> {
        // 模拟用户数据
        const mockUsers = [
            { id: 1, name: "张三", email: "zhangsan@example.com" },
            { id: 2, name: "李四", email: "lisi@example.com" },
            { id: 3, name: "王五", email: "wangwu@example.com" },
            { id: 4, name: "赵六", email: "zhaoliu@example.com" },
            { id: 5, name: "孙七", email: "sunqi@example.com" }
        ];

        const limit = input.limit || 5;
        const users = mockUsers.slice(0, Math.min(limit, mockUsers.length));

        console.log(`📋 获取到 ${users.length} 个用户:`);
        users.forEach(user => {
            console.log(`  - ${user.name} (${user.email})`);
        });

        return {
            success: true,
            users: users,
            total: users.length
        };
    }
}

/**
 * 模拟发送邮件的函数
 */
export class SendEmailFunction extends ExecutorFunction<any, any> {
    name = "sendEmail";

    async execute(input: {
        to: string;
        subject: string;
        template: string;
        userName: string;
        userIndex: number;
    }): Promise<any> {
        console.log(`📧 发送邮件给 ${input.userName} (${input.to}) [索引: ${input.userIndex}]`);
        console.log(`   主题: ${input.subject}`);
        console.log(`   模板: ${input.template}`);

        // 模拟邮件发送延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        // 模拟 80% 成功率
        const success = Math.random() > 0.2;

        if (success) {
            console.log(`   ✅ 邮件发送成功`);
            return {
                success: true,
                messageId: `msg_${Date.now()}_${input.userIndex}`,
                to: input.to,
                sentAt: new Date().toISOString()
            };
        } else {
            console.log(`   ❌ 邮件发送失败`);
            throw new Error(`邮件发送失败: ${input.to}`);
        }
    }
}

/**
 * 模拟生成报告的函数
 */
export class GenerateReportFunction extends ExecutorFunction<any, any> {
    name = "generateReport";

    async execute(input: {
        iteratorResults: any;
        totalUsers: number;
        successfulEmails: number;
        failedEmails: number;
    }): Promise<any> {
        console.log(`\n📊 生成批量处理报告:`);
        console.log(`   总用户数: ${input.totalUsers}`);
        console.log(`   成功发送: ${input.successfulEmails}`);
        console.log(`   失败发送: ${input.failedEmails}`);
        console.log(`   成功率: ${((input.successfulEmails / input.totalUsers) * 100).toFixed(1)}%`);

        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                total: input.totalUsers,
                successful: input.successfulEmails,
                failed: input.failedEmails,
                successRate: ((input.successfulEmails / input.totalUsers) * 100).toFixed(1) + '%'
            },
            details: input.iteratorResults.results?.map((result: any) => ({
                index: result.index,
                status: result.success ? '成功' : '失败',
                ...(result.success ? {
                    messageId: result.result.messageId,
                    sentAt: result.result.sentAt
                } : {
                    error: result.error
                })
            })) || []
        };

        console.log(`   报告生成完成: ${JSON.stringify(report, null, 2)}`);

        return report;
    }
}

// 导出函数实例供注册使用
export const mockFunctions = [
    new FetchUsersFunction(),
    new SendEmailFunction(),
    new GenerateReportFunction()
];

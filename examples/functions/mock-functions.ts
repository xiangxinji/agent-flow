import { ExecutorFunction } from "../../src/core/function/base";

/**
 * ============================================
 * 执行器节点相关函数
 * ============================================
 */

/**
 * 获取用户数据
 */
export class FetchUserDataFunction extends ExecutorFunction<any, any> {
    name = "fetchUserData";

    async execute(input: { userId: number; includeProfile: boolean }): Promise<any> {
        console.log(`📱 获取用户数据: userId=${input.userId}`);

        // 模拟数据库查询延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        const user = {
            id: input.userId,
            name: `用户${input.userId}`,
            email: `user${input.userId}@example.com`,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        const result: any = { user };

        if (input.includeProfile) {
            result.profile = {
                avatar: `https://api.example.com/avatar/${input.userId}`,
                bio: `这是用户${input.userId}的个人简介`,
                location: "北京",
                website: `https://user${input.userId}.example.com`
            };
        }

        return result;
    }
}

/**
 * 处理用户数据
 */
export class ProcessUserDataFunction extends ExecutorFunction<any, any> {
    name = "processUserData";

    async execute(input: {
        user: any;
        profile?: any;
        processingOptions: { validate: boolean; enrich: boolean };
    }): Promise<any> {
        console.log(`⚙️  处理用户数据: userId=${input.user.id}`);

        const result: any = {
            originalUser: input.user,
            processedAt: new Date().toISOString()
        };

        // 验证步骤
        if (input.processingOptions.validate) {
            result.validation = {
                emailValid: input.user.email.includes('@'),
                nameValid: input.user.name.length > 0,
                overallValid: true
            };
        }

        // 数据丰富步骤
        if (input.processingOptions.enrich) {
            result.enriched = {
                userTier: this.calculateUserTier(input.user),
                riskScore: Math.random() * 100,
                preferences: this.generatePreferences(input.user)
            };
        }

        return result;
    }

    private calculateUserTier(user: any): string {
        // 模拟用户等级计算
        const score = Math.random() * 100;
        if (score > 80) return 'gold';
        if (score > 60) return 'silver';
        return 'bronze';
    }

    private generatePreferences(user: any): string[] {
        const allPrefs = ['technology', 'sports', 'music', 'travel', 'food'];
        return allPrefs.slice(0, Math.floor(Math.random() * 3) + 1);
    }
}

/**
 * 计算用户分数
 */
export class CalculateUserScoreFunction extends ExecutorFunction<any, any> {
    name = "calculateUserScore";

    async execute(input: {
        processedData: any;
        scoringModel: string;
        weights: { activity: number; engagement: number; loyalty: number };
    }): Promise<any> {
        console.log(`📊 计算用户分数: 模型=${input.scoringModel}`);

        // 模拟评分计算
        const activityScore = Math.random() * 100;
        const engagementScore = Math.random() * 100;
        const loyaltyScore = Math.random() * 100;

        const finalScore = Math.round(
            activityScore * input.weights.activity +
            engagementScore * input.weights.engagement +
            loyaltyScore * input.weights.loyalty
        );

        return {
            score: finalScore,
            breakdown: {
                activity: Math.round(activityScore),
                engagement: Math.round(engagementScore),
                loyalty: Math.round(loyaltyScore)
            },
            model: input.scoringModel,
            calculatedAt: new Date().toISOString()
        };
    }
}

/**
 * 生成用户报告
 */
export class GenerateUserReportFunction extends ExecutorFunction<any, any> {
    name = "generateUserReport";

    async execute(input: {
        userData: any;
        processedData: any;
        score: any;
        reportFormat: string;
        includeCharts: boolean;
    }): Promise<any> {
        console.log(`📄 生成用户报告: 格式=${input.reportFormat}`);

        const report = {
            userId: input.userData.user.id,
            userName: input.userData.user.name,
            generatedAt: new Date().toISOString(),
            format: input.reportFormat,
            sections: {
                summary: {
                    userTier: input.processedData.enriched?.userTier || 'unknown',
                    score: input.score.score,
                    riskLevel: this.getRiskLevel(input.score.score)
                },
                details: {
                    profile: input.userData.profile,
                    validation: input.processedData.validation,
                    scoreBreakdown: input.score.breakdown
                },
                recommendations: this.generateRecommendations(input.score.score)
            },
            metadata: {
                includeCharts: input.includeCharts,
                processingTime: Math.round(Math.random() * 1000)
            }
        };

        return report;
    }

    private getRiskLevel(score: number): string {
        if (score > 80) return 'low';
        if (score > 60) return 'medium';
        return 'high';
    }

    private generateRecommendations(score: number): string[] {
        const recommendations = [];
        if (score > 80) {
            recommendations.push('可以考虑升级为VIP会员');
            recommendations.push('邀请参加专属活动');
        } else if (score > 60) {
            recommendations.push('提供个性化推荐');
            recommendations.push('增加互动频率');
        } else {
            recommendations.push('提供新人福利');
            recommendations.push('加强用户引导');
        }
        return recommendations;
    }
}

/**
 * ============================================
 * 分支节点相关函数
 * ============================================
 */

/**
 * 分析用户
 */
export class AnalyzeUserFunction extends ExecutorFunction<any, any> {
    name = "analyzeUser";

    async execute(input: { userId: number }): Promise<any> {
        console.log(`🔍 分析用户: userId=${input.userId}`);

        // 模拟用户分析
        const userTypes = ['vip', 'regular', 'guest'];
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];

        return {
            user: {
                id: input.userId,
                name: `用户${input.userId}`,
                type: userType,
                membershipLevel: userType === 'vip' ? 'platinum' : 'standard'
            },
            userType: userType,
            analysisTime: new Date().toISOString()
        };
    }
}

/**
 * 处理VIP用户
 */
export class HandleVipUserFunction extends ExecutorFunction<any, any> {
    name = "handleVipUser";

    async execute(input: { user: any; benefits: string[] }): Promise<any> {
        console.log(`⭐ 处理VIP用户: ${input.user.name}`);

        return {
            message: `欢迎尊贵的VIP会员 ${input.user.name}！`,
            benefits: input.benefits,
            specialOffers: [
                '专属客服热线',
                '优先处理',
                '额外积分奖励'
            ],
            processedAt: new Date().toISOString()
        };
    }
}

/**
 * 处理普通用户
 */
export class HandleRegularUserFunction extends ExecutorFunction<any, any> {
    name = "handleRegularUser";

    async execute(input: { user: any; upgradeOffer: boolean }): Promise<any> {
        console.log(`👤 处理普通用户: ${input.user.name}`);

        const result: any = {
            message: `你好 ${input.user.name}！`,
            processedAt: new Date().toISOString()
        };

        if (input.upgradeOffer) {
            result.upgradeOffer = {
                message: '升级为VIP会员享受更多特权！',
                discount: '首月8折优惠',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
        }

        return result;
    }
}

/**
 * 处理访客用户
 */
export class HandleGuestUserFunction extends ExecutorFunction<any, any> {
    name = "handleGuestUser";

    async execute(input: { user: any; promptRegistration: boolean }): Promise<any> {
        console.log(`👋 处理访客用户: ${input.user.name}`);

        const result: any = {
            message: `欢迎访客 ${input.user.name}！`,
            introduction: '感谢您访问我们的服务',
            processedAt: new Date().toISOString()
        };

        if (input.promptRegistration) {
            result.registrationPrompt = {
                message: '注册成为会员，享受更多服务',
                benefits: ['个性化推荐', '订单跟踪', '优惠通知'],
                callToAction: '立即注册'
            };
        }

        return result;
    }
}

/**
 * 处理未知用户
 */
export class HandleUnknownUserFunction extends ExecutorFunction<any, any> {
    name = "handleUnknownUser";

    async execute(input: { user: any; logIssue: boolean }): Promise<any> {
        console.log(`❓ 处理未知用户: ${input.user.name}`);

        const result: any = {
            message: '无法识别您的用户类型',
            supportContact: 'support@example.com',
            processedAt: new Date().toISOString()
        };

        if (input.logIssue) {
            result.issueLog = {
                userId: input.user.id,
                issue: 'Unknown user type detected',
                severity: 'medium',
                loggedAt: new Date().toISOString()
            };
        }

        return result;
    }
}

/**
 * ============================================
 * 并行节点相关函数
 * ============================================
 */

/**
 * 准备订单数据
 */
export class PrepareOrderDataFunction extends ExecutorFunction<any, any> {
    name = "prepareOrderData";

    async execute(input: { orderId: string }): Promise<any> {
        console.log(`📦 准备订单数据: orderId=${input.orderId}`);

        return {
            orderId: input.orderId,
            orderDate: new Date().toISOString(),
            paymentInfo: {
                method: 'credit_card',
                amount: Math.round(Math.random() * 10000),
                currency: 'CNY'
            },
            items: [
                { id: 1, name: '商品1', price: 100, quantity: 2 },
                { id: 2, name: '商品2', price: 200, quantity: 1 }
            ],
            totalWeight: Math.round(Math.random() * 5000),
            shippingAddress: {
                recipient: '张三',
                phone: '13800138000',
                address: '北京市朝阳区xxx街道xxx号'
            }
        };
    }
}

/**
 * 验证支付
 */
export class ValidatePaymentFunction extends ExecutorFunction<any, any> {
    name = "validatePayment";

    async execute(input: { paymentInfo: any; amount: number }): Promise<any> {
        console.log(`💳 验证支付: 金额=${input.amount}`);

        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

        const isValid = Math.random() > 0.1; // 90%成功率

        if (!isValid) {
            throw new Error('支付验证失败');
        }

        return {
            valid: true,
            paymentMethod: input.paymentInfo.method,
            transactionId: `txn_${Date.now()}`,
            validatedAt: new Date().toISOString()
        };
    }
}

/**
 * 检查库存
 */
export class CheckInventoryFunction extends ExecutorFunction<any, any> {
    name = "checkInventory";

    async execute(input: { items: any[]; warehouse: string }): Promise<any> {
        console.log(`📊 检查库存: 仓库=${input.warehouse}`);

        await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));

        return {
            available: true,
            items: input.items.map(item => ({
                ...item,
                stockLevel: Math.floor(Math.random() * 100) + 10,
                reserved: Math.floor(Math.random() * 5)
            })),
            warehouse: input.warehouse,
            checkedAt: new Date().toISOString()
        };
    }
}

/**
 * 计算运费
 */
export class CalculateShippingFunction extends ExecutorFunction<any, any> {
    name = "calculateShipping";

    async execute(input: {
        address: any;
        weight: number;
        method: string;
    }): Promise<any> {
        console.log(`🚚 计算运费: 方式=${input.method}`);

        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

        const baseRate = 10;
        const weightRate = Math.ceil(input.weight / 1000) * 5;
        const totalRate = baseRate + weightRate;

        return {
            method: input.method,
            baseRate: baseRate,
            weightRate: weightRate,
            totalRate: totalRate,
            estimatedDays: input.method === 'standard' ? 3 : 1,
            calculatedAt: new Date().toISOString()
        };
    }
}

/**
 * 完成订单
 */
export class FinalizeOrderFunction extends ExecutorFunction<any, any> {
    name = "finalizeOrder";

    async execute(input: {
        orderData: any;
        paymentResult: any;
        inventoryResult: any;
        shippingResult: any;
        confirmOrder: boolean;
    }): Promise<any> {
        console.log(`✅ 完成订单: orderId=${input.orderData.orderId}`);

        const result: any = {
            orderId: input.orderData.orderId,
            status: 'completed',
            completedAt: new Date().toISOString()
        };

        if (input.confirmOrder) {
            result.confirmation = {
                orderNumber: `ORD${Date.now()}`,
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                totalAmount: input.orderData.paymentInfo.amount + input.shippingResult.totalRate
            };
        }

        return result;
    }
}

/**
 * ============================================
 * Agent节点相关函数
 * ============================================
 */

/**
 * 解析Agent响应
 */
export class ParseAgentResponseFunction extends ExecutorFunction<any, any> {
    name = "parseAgentResponse";

    async execute(input: { agentResponse: any }): Promise<any> {
        console.log(`🔬 解析Agent响应`);

        // 模拟解析Agent响应
        const queryTypes = ['product-inquiry', 'technical-support', 'billing-issue'];
        const queryType = queryTypes[Math.floor(Math.random() * queryTypes.length)];

        return {
            queryType: queryType,
            priority: Math.random() > 0.5 ? 'high' : 'normal',
            confidence: Math.round(Math.random() * 30 + 70),
            parsedAt: new Date().toISOString()
        };
    }
}

// 导出所有函数供测试使用
export const allMockFunctions = [
    // Executor相关
    new FetchUserDataFunction(),
    new ProcessUserDataFunction(),
    new CalculateUserScoreFunction(),
    new GenerateUserReportFunction(),

    // Branch相关
    new AnalyzeUserFunction(),
    new HandleVipUserFunction(),
    new HandleRegularUserFunction(),
    new HandleGuestUserFunction(),
    new HandleUnknownUserFunction(),

    // Parallel相关
    new PrepareOrderDataFunction(),
    new ValidatePaymentFunction(),
    new CheckInventoryFunction(),
    new CalculateShippingFunction(),
    new FinalizeOrderFunction(),

    // Agent相关
    new ParseAgentResponseFunction()
];

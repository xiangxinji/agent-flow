import dotenv from 'dotenv';
dotenv.config();

import { testBranchNode } from './test-runner';
import { testParallelNode } from './test-runner';
import { testIteratorNode } from './test-iterator';

async function runAllTests() {
    console.log('🚀 开始运行所有测试');
    
    try {
        // 运行 branch 节点测试
        await testBranchNode();
        
        // 运行 parallel 节点测试
        await testParallelNode();
        
        // 运行 iterator 节点测试
        await testIteratorNode();
        
        console.log('\n� 所有测试运行完成');
    } catch (error) {
        console.error('❌ 测试运行失败:', error);
    }
}

// 运行所有测试
runAllTests();
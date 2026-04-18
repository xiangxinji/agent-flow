import { Hono } from 'hono';
import { GraphNodeType } from '@/core/interface/graph/graph';

interface NodeTypeInfo {
  type: GraphNodeType;
  label: string;
  icon: string;
  color: string;
  description: string;
  configSchema: Record<string, any>;
}

const nodeApi: Hono = new Hono();

nodeApi.get('/findAll', (c) => {
  const nodeTypes: NodeTypeInfo[] = [
    {
      type: 'agent',
      label: '智能代理',
      icon: '🤖',
      color: '#42b883',
      description: 'AI 代理节点，用于执行 AI 模型调用',
      configSchema: {
        instructions: { type: 'string', required: true, label: '指令' },
        model: { type: 'select', required: true, label: '模型', options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] },
        input: { type: 'object', required: true, label: '输入', properties: { prompt: { type: 'string' } } }
      }
    },
    {
      type: 'function-call',
      label: '函数调用',
      icon: '⚡',
      color: '#f59e0b',
      description: '函数调用节点，用于执行工具函数',
      configSchema: {
        fnName: { type: 'string', required: true, label: '函数名称' },
        input: { type: 'object', required: true, label: '输入参数' }
      }
    },
    {
      type: 'branch',
      label: '分支',
      icon: '🔀',
      color: '#8b5cf6',
      description: '条件分支节点，根据条件执行不同分支',
      configSchema: {
        cases: {
          type: 'array',
          required: true,
          label: '条件分支',
          items: {
            condition: { type: 'string', required: true, label: '条件' },
            target: { type: 'string', required: true, label: '目标节点' }
          }
        },
        next: { type: 'string', required: false, label: '下一步（可选）' }
      }
    },
    {
      type: 'iterator',
      label: '迭代器',
      icon: '🔄',
      color: '#ec4899',
      description: '迭代器节点，用于遍历数组执行子工作流',
      configSchema: {
        array: { type: 'Input', required: true, label: '数组数据源' },
        itemKey: { type: 'string', required: false, label: '元素键名', default: 'item' },
        indexKey: { type: 'string', required: false, label: '索引键名', default: 'index' },
        target: { type: 'string', required: true, label: '目标节点' },
        next: { type: 'string', required: false, label: '下一步（可选）' },
        parallel: { type: 'boolean', required: false, label: '并行处理', default: false }
      }
    },
    {
      type: 'parallel',
      label: '并行',
      icon: '⚡',
      color: '#06b6d4',
      description: '并行执行节点，同时执行多个分支',
      configSchema: {
        branches: { type: 'array', required: true, label: '分支列表', items: { type: 'string' } },
        next: { type: 'string', required: false, label: '下一步（可选）' }
      }
    },
    {
      type: 'intent-recognition',
      label: '意图识别',
      icon: '🎯',
      color: '#ef4444',
      description: '意图识别节点，识别用户意图并路由到对应目标',
      configSchema: {
        agent: {
          type: 'object',
          required: true,
          label: '代理配置',
          properties: {
            instructions: { type: 'string', required: true, label: '指令' },
            model: { type: 'select', required: true, label: '模型', options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] }
          }
        },
        input: { type: 'object', required: true, label: '输入数据', properties: { data: { type: 'Input' } } },
        intentions: {
          type: 'array',
          required: true,
          label: '意图列表',
          items: {
            name: { type: 'string', required: true, label: '意图名称' },
            target: { type: 'string', required: true, label: '目标节点' }
          }
        },
        defaultTarget: { type: 'string', required: false, label: '默认目标（可选）' }
      }
    }
  ];

  return c.json({
    success: true,
    data: nodeTypes,
    message: 'Node types retrieved successfully'
  });
});

export default nodeApi;
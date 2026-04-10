import { Hono } from 'hono';
import { GraphBuilder } from '@/core/graph/builder';
import { WorkflowEngine } from '@/workflow-engine';

const workflowApi = new Hono();

// 运行工作流接口
workflowApi.post('/run', async (c) => {
  try {
    const body = await c.req.json();
    
    // 构建工作流
    const builder = new GraphBuilder({
      id: body.id || 'test',
      name: body.name || 'test',
      version: body.version || '1.0.0',
      nodes: body.nodes || [],
      edges: body.edges || [],
      root: body.root || 'test-1'
    });
    
    const workflow = builder.build();
    const engine = new WorkflowEngine(workflow);
    
    // 运行工作流
    const result = await engine.run(body.input || {});
    
    return c.json({
      success: true,
      result,
      message: 'Workflow executed successfully'
    });
  } catch (error) {
    console.error('Error running workflow:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to execute workflow'
    }, 500);
  }
});

// 工作流状态接口
workflowApi.get('/status', (c) => {
  return c.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default workflowApi;
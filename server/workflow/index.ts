import { Hono } from 'hono';
import { GraphBuilder } from '@/core/graph/builder';
import { WorkflowEngine } from '@/core/workflow/engine';
import { BasePlugin } from '@/core/plugins/base'
const workflowApi: Hono = new Hono();

// 运行工作流接口
workflowApi.post('/run', async (c) => {
  try {
    const body = await c.req.json();
    // 构建工作流
    const builder = new GraphBuilder({
      id: body.id,
      name: body.name,
      version: body.version,
      nodes: body.nodes || [],
      edges: body.edges || [],
      root: body.root
    });

    const workflow = builder.build();
    const engine = new WorkflowEngine(workflow , { 
      history: true,
      event: true,
      plugins: [
        new BasePlugin()
      ]
    });

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
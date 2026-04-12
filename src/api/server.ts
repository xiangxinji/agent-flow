import * as dotenv from 'dotenv';


import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import api from './index';
// 加载环境变量
dotenv.config();
const app = new Hono();
const PORT = process.env.PORT || 3000;



// 健康检查接口
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API 路由
app.route('/api', api);

// 404 处理
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    message: 'The requested resource was not found'
  }, 404);
});

// 启动服务器
if (require.main === module) {
  serve({
    fetch: app.fetch,
    port: Number(PORT)
  });
  console.log(`Server started on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Workflow API: http://localhost:${PORT}/api/workflow/run`);
}

export default app;
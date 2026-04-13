import { Hono } from 'hono';
import workflowApi from './workflow';

const api: Hono = new Hono();

// 工作流 API
api.route('/workflow', workflowApi);

// 这里可以添加其他 API 模块
// 例如：api.route('/user', userApi);
//       api.route('/auth', authApi);

export default api;
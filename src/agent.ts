import { Agent } from '@mastra/core/agent';
import dotenv from 'dotenv';

dotenv.config();

export const myAgent = new Agent({
  name: 'MyAgent',
  instructions: 'You are a helpful assistant that can answer questions and help with tasks.',
  model: 'openai/gpt-4o-mini',
});

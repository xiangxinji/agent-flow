import { myAgent } from './agent';

async function main() {
  console.log('Starting Mastra Agent...');
  
  try {
    const response = await myAgent.generate('Hello, can you introduce yourself?');
    console.log('Agent response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

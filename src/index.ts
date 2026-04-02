import { MastraWorkflowAdapter } from "./adapter/mastra";

const testWorkflow = {
  "id": "test-workflow-1",
  "name": "测试工作流",
  "version": "1.0.0",
  "startNodeId": "node-1",
  "globals": {
    "apiKey": "test-api-key",
    "model": "gpt-4o-mini"
  },
  "nodes": [
    {
      "id": "node-1",
      "type": "execution",
      "metadata": {
        "x": 100,
        "y": 100,
        "label": "开始节点"
      },
      "input": {
        "message": {
          "type": "constant",
          "value": "Hello World"
        }
      },
      "executor": {
        "type": "function",
        "functionName": "helloFunction"
      },
      "next": "node-2"
    },
    {
      "id": "node-2",
      "type": "branch",
      "metadata": {
        "x": 300,
        "y": 100,
        "label": "分支节点"
      },
      "source": "$.steps['node-1'].output.result",
      "cases": [
        {
          "expression": "== 'success'",
          "target": "node-3"
        },
        {
          "expression": "== 'error'",
          "target": "node-4"
        }
      ],
      "default": "node-5"
    },
    {
      "id": "node-3",
      "type": "execution",
      "metadata": {
        "x": 500,
        "y": 50,
        "label": "成功处理"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "successHandler"
      },
      "next": "node-6"
    },
    {
      "id": "node-4",
      "type": "execution",
      "metadata": {
        "x": 500,
        "y": 150,
        "label": "错误处理"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "errorHandler"
      },
      "next": "node-6"
    },
    {
      "id": "node-5",
      "type": "execution",
      "metadata": {
        "x": 500,
        "y": 250,
        "label": "默认处理"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "defaultHandler"
      },
      "next": "node-6"
    },
    {
      "id": "node-6",
      "type": "parallel",
      "metadata": {
        "x": 700,
        "y": 150,
        "label": "并行节点"
      },
      "branches": [
        {
          "target": "node-7"
        },
        {
          "target": "node-8"
        }
      ],
      "next": "node-9"
    },
    {
      "id": "node-7",
      "type": "execution",
      "metadata": {
        "x": 900,
        "y": 100,
        "label": "并行任务1"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "task1"
      }
    },
    {
      "id": "node-8",
      "type": "execution",
      "metadata": {
        "x": 900,
        "y": 200,
        "label": "并行任务2"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "task2"
      }
    },
    {
      "id": "node-9",
      "type": "execution",
      "metadata": {
        "x": 1100,
        "y": 150,
        "label": "结束节点"
      },
      "input": {},
      "executor": {
        "type": "function",
        "functionName": "finish"
      }
    }
  ]
};

const adapter = new MastraWorkflowAdapter(testWorkflow as any );

console.log('测试工作流创建成功:', adapter);


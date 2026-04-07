/**
 * Graph Builder Usage Example
 * Demonstrates how to use the DAG Workflow Engine
 */

import {
  GraphBuilder,
  ExecutionEngine,
  SchemaValidator,
  Flow,
  StepDefinition,
  log,
} from '../src/core/graph';

// ==========================================
// 1. Define a Flow DSL (from UI Editor)
// ==========================================

const simpleFlow: Flow = {
  nodes: [
    {
      id: 'start',
      type: 'trigger',
      config: {
        input: { message: 'Hello World' },
      },
    },
    {
      id: 'process',
      type: 'processor',
      config: {
        input: {
          data: '$.start.output', // Reference to previous node output
        },
      },
    },
    {
      id: 'branch',
      type: 'decision',
      config: {
        input: {
          result: '$.process.output',
        },
      },
    },
    {
      id: 'success',
      type: 'successHandler',
    },
    {
      id: 'error',
      type: 'errorHandler',
    },
    {
      id: 'parallel1',
      type: 'parallelTask1',
    },
    {
      id: 'parallel2',
      type: 'parallelTask2',
    },
    {
      id: 'end',
      type: 'finalizer',
    },
  ],
  edges: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'branch' },
    { from: 'branch', to: 'success', condition: 'eq(data.success, true)' },
    { from: 'branch', to: 'error', condition: 'eq(data.success, false)' },
    { from: 'success', to: 'parallel1' },
    { from: 'success', to: 'parallel2' },
    { from: 'parallel1', to: 'end' },
    { from: 'parallel2', to: 'end' },
  ],
};

// ==========================================
// 2. Define Step Implementations
// ==========================================

const stepRegistry: Record<string, StepDefinition> = {
  trigger: {
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'number' },
      },
    },
    execute: async (input) => {
      log('trigger', 'started', input);
      return {
        message: input.message,
        timestamp: Date.now(),
      };
    },
  },

  processor: {
    inputSchema: {
      type: 'object',
      properties: {
        data: { type: 'any' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        result: { type: 'any' },
      },
    },
    execute: async (input) => {
      log('processor', 'processing', input);
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {
        success: true,
        result: `Processed: ${JSON.stringify(input.data)}`,
      };
    },
  },

  decision: {
    inputSchema: {
      type: 'object',
      properties: {
        result: { type: 'any' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        decision: { type: 'string' },
      },
    },
    execute: async (input) => {
      log('decision', 'deciding', input);
      return {
        decision: input.result?.success ? 'success' : 'error',
      };
    },
  },

  successHandler: {
    execute: async (input) => {
      log('successHandler', 'executing', input);
      return { status: 'success', message: 'Operation completed successfully' };
    },
  },

  errorHandler: {
    execute: async (input) => {
      log('errorHandler', 'executing', input);
      return { status: 'error', message: 'Operation failed' };
    },
  },

  parallelTask1: {
    execute: async (input) => {
      log('parallelTask1', 'executing', input);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { task: 'task1', result: 'Task 1 completed' };
    },
  },

  parallelTask2: {
    execute: async (input) => {
      log('parallelTask2', 'executing', input);
      await new Promise((resolve) => setTimeout(resolve, 150));
      return { task: 'task2', result: 'Task 2 completed' };
    },
  },

  finalizer: {
    execute: async (input) => {
      log('finalizer', 'executing', input);
      return { status: 'completed', message: 'Workflow finished' };
    },
  },
};

// ==========================================
// 3. Usage Examples
// ==========================================

async function demonstrateGraphBuilder() {
  console.log('=== Graph Builder Demo ===\n');

  // Build graph from flow
  console.log('1. Building graph from Flow DSL...');
  const graph = GraphBuilder.buildGraph(simpleFlow);
  console.log(`✓ Graph built with ${graph.size} nodes\n`);

  // Get graph statistics
  console.log('2. Graph Statistics:');
  const stats = GraphBuilder.getGraphStats(simpleFlow);
  console.log(stats);
  console.log();

  // Validate graph
  console.log('3. Validating graph structure...');
  const validation = GraphBuilder.validateGraph(graph);
  console.log(validation);
  console.log();

  // Topological sort
  console.log('4. Topological Sort (execution order):');
  const sortedNodes = GraphBuilder.topologicalSort(graph);
  console.log(sortedNodes.map((n) => n.id));
  console.log();

  // Build execution plan
  console.log('5. Building Execution Plan:');
  const plan = GraphBuilder.buildExecutionPlan(graph);
  console.log(JSON.stringify(plan, null, 2));
  console.log();

  // Schema validation
  console.log('6. Schema Validation:');
  const schemaValidation = SchemaValidator.validateGraphConnections(graph, stepRegistry);
  console.log(schemaValidation);
  console.log();

  // Execute workflow
  console.log('7. Executing Workflow:');
  console.log('---');
  const engine = new ExecutionEngine(stepRegistry, {
    enableLogging: true,
    retries: 2,
    timeout: 5000,
    onNodeComplete: (result) => {
      log(result.nodeId, 'completed', {
        success: result.success,
        duration: result.endTime - result.startTime,
      });
    },
  });

  const executionResult = await engine.execute(graph, {});

  console.log('---');
  console.log('\n8. Execution Results:');
  console.log(`Success: ${executionResult.success}`);
  console.log(`Total Duration: ${executionResult.totalDuration}ms`);
  console.log(`Nodes Executed: ${executionResult.results.length}`);
  console.log('\nIndividual Results:');
  for (const result of executionResult.results) {
    console.log(`  ${result.nodeId}: ${result.success ? '✓' : '✗'} (${result.endTime - result.startTime}ms)`);
  }

  console.log('\nFinal Context:');
  console.log(JSON.stringify(executionResult.context, null, 2));
}

// ==========================================
// 4. Advanced Examples
// ==========================================

async function demonstrateConditionalBranching() {
  console.log('\n=== Conditional Branching Demo ===\n');

  const conditionalFlow: Flow = {
    nodes: [
      {
        id: 'input',
        type: 'inputProcessor',
        config: { input: { value: 42 } },
      },
      {
        id: 'decision',
        type: 'decisionMaker',
      },
      {
        id: 'greaterThan50',
        type: 'highValueHandler',
      },
      {
        id: 'lessThan50',
        type: 'lowValueHandler',
      },
    ],
    edges: [
      { from: 'input', to: 'decision' },
      { from: 'decision', to: 'greaterThan50', condition: 'gt(value, 50)' },
      { from: 'decision', to: 'lessThan50', condition: 'lte(value, 50)' },
    ],
  };

  const graph = GraphBuilder.buildGraph(conditionalFlow);
  const plan = GraphBuilder.buildExecutionPlan(graph);

  console.log('Conditional Execution Plan:');
  console.log(JSON.stringify(plan, null, 2));
}

async function demonstrateParallelExecution() {
  console.log('\n=== Parallel Execution Demo ===\n');

  const parallelFlow: Flow = {
    nodes: [
      {
        id: 'start',
        type: 'starter',
      },
      {
        id: 'task1',
        type: 'parallelTask1',
      },
      {
        id: 'task2',
        type: 'parallelTask2',
      },
      {
        id: 'task3',
        type: 'parallelTask3',
      },
      {
        id: 'end',
        type: 'finisher',
      },
    ],
    edges: [
      { from: 'start', to: 'task1' },
      { from: 'start', to: 'task2' },
      { from: 'start', to: 'task3' },
      { from: 'task1', to: 'end' },
      { from: 'task2', to: 'end' },
      { from: 'task3', to: 'end' },
    ],
  };

  const graph = GraphBuilder.buildGraph(parallelFlow);
  const plan = GraphBuilder.buildExecutionPlan(graph);

  console.log('Parallel Execution Plan:');
  console.log(JSON.stringify(plan, null, 2));
}

// ==========================================
// 5. Run Examples
// ==========================================

async function main() {
  try {
    await demonstrateGraphBuilder();
    await demonstrateConditionalBranching();
    await demonstrateParallelExecution();

    console.log('\n=== All demos completed successfully! ===');
  } catch (error) {
    console.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export {
  demonstrateGraphBuilder,
  demonstrateConditionalBranching,
  demonstrateParallelExecution,
};

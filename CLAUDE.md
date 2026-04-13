# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a DAG (Directed Acyclic Graph) Workflow Engine that provides visual workflow orchestration capabilities similar to Dify/n8n. The system integrates with the Mastra framework for agent execution and provides a three-layer architecture: Router → Planner → Executor.

## Development Commands

- `npm run dev` - Run in development mode using ts-node
- `npm run build` - Compile TypeScript to dist/ directory
- `npm run server` or `npm start` - Start the HTTP API server (default port 3000)
- `npm run type-check` - Type check TypeScript without emitting files

The project uses TypeScript with path aliases (`@/*` maps to `src/*`) and requires the `tsconfig-paths` package for proper resolution during development.

## Architecture

### Core Components

1. **DSL Layer** (`src/interface/graph/`)
   - Defines the Flow DSL structure with nodes and edges
   - Node types: `agent`, `branch`, `iterator`, `parallel`, `subgraph`, `function-call`
   - Input types support: `literal`, `ref` (node output references), `template`

2. **Workflow Core** (`src/core/workflow/`)
   - `Workflow` class: Container for nodes with workflow metadata
   - `BaseNode`: Abstract base class for all node types
   - Node implementations: `ExecutorNode`, `BranchNode`, `ParallelNode`, `IteratorNode`, `SubGraphNode`
   - `ExecutorRuntime`: Context provider for node execution

3. **Graph Builder** (`src/core/graph/builder.ts`)
   - Converts Flow DSL into Workflow instances
   - Handles edge mapping between nodes
   - Special handling for parallel and branch node connections

4. **Workflow Engine** (`src/workflow-engine/`)
   - `WorkflowEngine`: Main execution engine that runs workflows
   - `EngineStateManager`: State management using `'$'` as root state key
   - `EventManager`: Event-driven architecture for workflow lifecycle
   - `WorkflowHistory`: Optional execution history tracking

5. **Factory Pattern** (`src/core/factory/`)
   - `NodeFactory`: Creates node instances from DSL definitions
   - `ExecutorFactory`: Creates executor instances (agent, function-call)

6. **Function Registry** (`src/function/`)
   - `FunctionRegistry`: Registry for executable functions
   - Built-in functions: `to-json`, `log`, `fetch`
   - Extendable by registering new `ExecutorFunction` instances

### Data Flow Architecture

1. **Input Resolution**: Nodes reference outputs from previous nodes using dot-notation (e.g., `nodeId.path.to.value`)
2. **State Management**:
   - Root input stored under `'$'` key
   - Node outputs stored under their node ID
   - State is immutable (uses lodash.cloneDeep)
3. **Input Types**:
   - `literal`: Fixed values
   - `ref`: References to other node outputs
   - `template`: String templates with `${nodeId.path}` variable interpolation

### Execution Model

The engine supports:
- **Sequential execution**: Standard node-to-node flow
- **Parallel execution**: Multiple branches executed concurrently via `Promise.all`
- **Branch execution**: Conditional routing based on expression evaluation
- **Event system**: Emits events at key lifecycle stages (init, running, completed, etc.)

### Integration Points

- **Mastra Framework**: Used for agent execution via `@mastra/core`
- **HTTP API**: Hono-based REST API for workflow execution
- **Environment**: Uses dotenv for configuration (PORT variable)

## Key Patterns

### Adding New Node Types

1. Define the node interface in `src/interface/graph/graph.ts`
2. Create the node class extending `BaseNode` in `src/core/workflow/node/`
3. Add the node type to `NodeType` union in `src/core/workflow/node/base.ts`
4. Register the node in `NodeFactory.create()`

### Adding New Functions

1. Extend `ExecutorFunction` from `src/function/base.ts`
2. Implement the `execute()` method
3. Register in `FunctionRegistry` constructor

### State Access in Nodes

Use `EngineStateGetter.getInput()` to resolve inputs from state. The function handles:
- Literal values
- References to other node outputs (`{ type: 'ref', path: 'nodeId.path' }`)
- Template strings with variable interpolation

## Important Notes

- The root state key is `'$'` - all workflow input is stored here
- Node outputs are automatically stored under their node ID in state
- Branch conditions use the `ConditionParser` for expression evaluation
- The system uses deep cloning to prevent state mutation
- Event listeners can be attached via `engine.event.on(stage, callback)`

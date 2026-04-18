## ADDED Requirements

### Requirement: Intent Recognition Node Definition
The system SHALL support a new node type `intent-recognition` that uses AI Agent to analyze input state and route to target nodes based on recognized intent.

#### Scenario: Basic Intent Recognition
- **WHEN** an intent-recognition node is configured with agent instructions and intent mappings
- **THEN** the node SHALL use the agent to analyze input state and route to the corresponding target node

#### Scenario: Default Routing
- **WHEN** an intent-recognition node is configured with a default target
- **THEN** the node SHALL route to the default target when no intent is recognized

### Requirement: Intent Recognition Node Configuration
The intent-recognition node SHALL accept the following configuration:
- `agent`: Agent configuration including instructions and model
- `input`: Input data source configuration
- `intentions`: Mapping of intent names to target node IDs
- `defaultTarget`: Optional default target node ID for unrecognized intents
- `outputKey`: Optional key to store intent recognition results in state

#### Scenario: Full Configuration
- **WHEN** an intent-recognition node is configured with all required fields
- **THEN** the node SHALL use the configuration to perform intent recognition and routing

#### Scenario: Minimal Configuration
- **WHEN** an intent-recognition node is configured with only required fields
- **THEN** the node SHALL use default values for optional fields

### Requirement: Intent Recognition Execution
The intent-recognition node SHALL:
1. Retrieve input data from the specified source
2. Use the configured agent to analyze the input and recognize intent
3. Map the recognized intent to a target node using the intentions mapping
4. Store the intent recognition result in the state
5. Route to the mapped target node
6. Route to the default target if no intent is recognized

#### Scenario: Intent Recognition and Routing
- **WHEN** input state contains data that matches a configured intent
- **THEN** the node SHALL recognize the intent and route to the corresponding target node

#### Scenario: Unrecognized Intent
- **WHEN** input state contains data that doesn't match any configured intent
- **THEN** the node SHALL route to the default target if configured, or stop execution

### Requirement: Intent Result Storage
The intent-recognition node SHALL store the intent recognition result in the state using the configured `outputKey` or a default key if not specified.

#### Scenario: Result Storage with Custom Key
- **WHEN** an intent-recognition node is configured with a custom outputKey
- **THEN** the node SHALL store the intent recognition result using the custom key

#### Scenario: Result Storage with Default Key
- **WHEN** an intent-recognition node is not configured with an outputKey
- **THEN** the node SHALL store the intent recognition result using the default key

### Requirement: Agent Integration
The intent-recognition node SHALL use the existing Mastra agent capabilities for intent recognition.

#### Scenario: Agent Execution
- **WHEN** an intent-recognition node is executed
- **THEN** the node SHALL create and use a Mastra agent with the configured instructions and model

#### Scenario: Agent Error Handling
- **WHEN** the agent execution fails
- **THEN** the node SHALL handle the error gracefully and route to the default target if configured

### Requirement: State Management Integration
The intent-recognition node SHALL integrate with the existing state management system to:
- Retrieve input data from the state
- Store intent recognition results in the state
- Pass state to downstream nodes

#### Scenario: State Input
- **WHEN** the intent-recognition node retrieves input from the state
- **THEN** the node SHALL use the configured input source to get data from the state

#### Scenario: State Output
- **WHEN** the intent-recognition node stores results in the state
- **THEN** the node SHALL add the intent recognition result to the state

## MODIFIED Requirements

### Requirement: Graph Node Types
The `GraphNodeType` enum SHALL be updated to include the new `intent-recognition` node type.

#### Scenario: Node Type Registration
- **WHEN** the system initializes
- **THEN** the `intent-recognition` node type SHALL be available for use in workflows

### Requirement: Executor Factory
The `ExecutorFactory` SHALL be updated to support the creation of `IntentRecognitionExecutor` instances for `intent-recognition` nodes.

#### Scenario: Executor Creation
- **WHEN** an `intent-recognition` node is executed
- **THEN** the `ExecutorFactory` SHALL create and return an `IntentRecognitionExecutor` instance

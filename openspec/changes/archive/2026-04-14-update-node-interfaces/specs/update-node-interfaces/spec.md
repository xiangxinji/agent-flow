## Overview

为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记，类似于 IIteratorNode 接口，使节点配置更加一致和清晰。

## ADDED Requirements

### Requirement: Branch Key for IBranchNode
- **Shall** add a branch key to the IBranchNode interface to store cases and next properties
- **Shall** ensure the branch property contains cases and next sub-properties

#### Scenario: Adding branch key to IBranchNode
- **Given** the IBranchNode interface
- **When** I add a branch key to store cases and next properties
- **Then** the IBranchNode interface should have a branch property that contains cases and next

### Requirement: Parallel Key for IParallelNode
- **Shall** add a parallel key to the IParallelNode interface to store branches and next properties
- **Shall** ensure the parallel property contains branches and next sub-properties

#### Scenario: Adding parallel key to IParallelNode
- **Given** the IParallelNode interface
- **When** I add a parallel key to store branches and next properties
- **Then** the IParallelNode interface should have a parallel property that contains branches and next

## MODIFIED Requirements

### Requirement: Update BranchNode Class
- **Shall** update the BranchNode class to use the new branch key
- **Shall** ensure the BranchNode class correctly handles the new interface definition

#### Scenario: Updating BranchNode class
- **Given** the BranchNode class
- **When** I update it to use the new branch key
- **Then** the BranchNode class should correctly handle the new interface definition

### Requirement: Update ParallelNode Class
- **Shall** update the ParallelNode class to use the new parallel key
- **Shall** ensure the ParallelNode class correctly handles the new interface definition

#### Scenario: Updating ParallelNode class
- **Given** the ParallelNode class
- **When** I update it to use the new parallel key
- **Then** the ParallelNode class should correctly handle the new interface definition

### Requirement: Update GraphBuilder
- **Shall** update the GraphBuilder class to use the new branch and parallel keys
- **Shall** ensure the GraphBuilder class correctly handles the new interface definitions

#### Scenario: Updating GraphBuilder
- **Given** the GraphBuilder class
- **When** I update it to use the new branch and parallel keys
- **Then** the GraphBuilder class should correctly handle the new interface definitions

### Requirement: Update NodeFactory
- **Shall** update the NodeFactory class to use the new branch and parallel keys
- **Shall** ensure the NodeFactory class correctly creates nodes with the new interface definitions

#### Scenario: Updating NodeFactory
- **Given** the NodeFactory class
- **When** I update it to use the new branch and parallel keys
- **Then** the NodeFactory class should correctly create nodes with the new interface definitions

## Test Cases

1. **测试用例**：
   - 验证 BranchNode 类能够正确处理新的接口定义
   - 验证 ParallelNode 类能够正确处理新的接口定义
   - 验证修改后的接口与现有的工作流配置兼容

## Acceptance Criteria

1. 接口定义修改完成
2. 节点实现更新完成
3. 测试用例通过
4. 与现有的工作流配置兼容
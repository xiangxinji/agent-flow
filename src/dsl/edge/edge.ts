

// 连线类
export class WorkflowEdge {
  constructor(
    public readonly sourceId: string,
    public readonly targetId: string,
    public readonly condition?: string
  ) {}
}
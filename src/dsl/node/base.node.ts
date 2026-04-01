// 所有的节点基类
export abstract class MastraNode {
  public readonly id: string;
  public readonly type: string;
  public inputs: Record<string, any> = {};
  public outputs: Record<string, any> = {};

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }

  // 每个节点需要定义如何转换为 Mastra 的 Step
  abstract toStep(): any;
}
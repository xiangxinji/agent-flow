import { MastraNode } from "./base.node";

export class ToolNode extends MastraNode {
  constructor(id: string, private toolId: string) {
    super(id, 'TOOL_NODE');
  }

  toStep() {
    return {
      id: this.id,
      execute: async () => {
        // 调用预定义的工具函数（如 ripgrep, fs-read）
      }
    };
  }
}
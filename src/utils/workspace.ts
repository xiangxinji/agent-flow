import path from 'node:path';

export class Workspace {
    private readonly root: string;

    constructor(rootPath: string) {
        this.root = path.resolve(rootPath);
    }

    // 安全路径解析：确保最终路径在 root 内部
    public resolve(userInputPath: string): string {
        const finalPath = path.resolve(this.root, userInputPath);

        if (!finalPath.startsWith(this.root)) {
            throw new Error(`非法路径访问: 试图超出工作区范围`);
        }
        return finalPath;
    }
}
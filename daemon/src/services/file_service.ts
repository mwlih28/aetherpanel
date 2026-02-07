import fs from 'fs-extra';
import path from 'path';

export class FileService {
    static async listFiles(id: string, relativePath: string = '.') {
        const basePath = path.join(process.cwd(), 'data', id);
        const targetPath = path.join(basePath, relativePath);

        if (!targetPath.startsWith(basePath)) throw new Error('Security Error: Path traversal');

        const files = await fs.readdir(targetPath, { withFileTypes: true });
        return files.map(f => ({
            name: f.name,
            isDirectory: f.isDirectory(),
            size: f.isDirectory() ? null : fs.statSync(path.join(targetPath, f.name)).size,
            mtime: fs.statSync(path.join(targetPath, f.name)).mtime
        }));
    }

    static async readFile(id: string, fileName: string) {
        const filePath = path.join(process.cwd(), 'data', id, fileName);
        return await fs.readFile(filePath, 'utf8');
    }

    static async writeFile(id: string, fileName: string, content: string) {
        const filePath = path.join(process.cwd(), 'data', id, fileName);
        await fs.writeFile(filePath, content, 'utf8');
    }
}

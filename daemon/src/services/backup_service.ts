import tar from 'tar';
import path from 'path';
import fs from 'fs-extra';

export class BackupService {
    static async createBackup(serverId: string) {
        const serverPath = path.join(process.cwd(), 'data', serverId);
        const backupPath = path.join(process.cwd(), 'backups', serverId);
        await fs.ensureDir(backupPath);

        const backupName = `backup-${Date.now()}.tar.gz`;
        const fullBackupPath = path.join(backupPath, backupName);

        await tar.c(
            {
                gzip: true,
                file: fullBackupPath,
                cwd: serverPath
            },
            ['.']
        );

        return { name: backupName, size: (await fs.stat(fullBackupPath)).size };
    }

    static async listBackups(serverId: string) {
        const backupPath = path.join(process.cwd(), 'backups', serverId);
        if (!(await fs.pathExists(backupPath))) return [];
        const files = await fs.readdir(backupPath);
        return files.map(f => ({
            name: f,
            size: fs.statSync(path.join(backupPath, f)).size,
            date: fs.statSync(path.join(backupPath, f)).mtime
        }));
    }
}

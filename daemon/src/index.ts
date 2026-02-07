import { Server, Socket } from 'socket.io';
import Docker from 'dockerode';
import { FileService } from './services/file_service';
import { PluginService } from './services/plugin_service';
import { BackupService } from './services/backup_service';

// Initialize Docker connection
const docker = new Docker();

// Initialize Socket.io Server (Standalone)
const port = parseInt(process.env.PORT || '3002');
const io = new Server(port, {
    cors: {
        origin: '*', // In production, restrict this to Panel IP
        methods: ["GET", "POST"]
    }
});

console.log(`[DAEMON] Aetherpanel Daemon (Wings) listening on port ${port}`);

io.on('connection', (socket: Socket) => {
    console.log('[DAEMON] New connection:', socket.id);

    socket.on('server:list', async () => {
        try {
            const containers = await docker.listContainers({ all: true });
            socket.emit('server:list', containers);
        } catch (error) {
            socket.emit('error', 'Failed to list containers');
        }
    });

    socket.on('server:power', async ({ id, action }: { id: string, action: 'start' | 'stop' | 'kill' }) => {
        const container = docker.getContainer(id);
        try {
            if (action === 'start') await container.start();
            if (action === 'stop') await container.stop();
            if (action === 'kill') await container.kill();
            socket.emit('server:power:success', { id, action });
        } catch (error: any) {
            socket.emit('error', error.message);
        }
    });

    socket.on('server:console', async ({ id }: { id: string }) => {
        const container = docker.getContainer(id);
        try {
            const stream = await container.attach({
                stream: true,
                stdout: true,
                stderr: true,
                stdin: true
            });

            stream.on('data', (chunk) => {
                socket.emit('server:console:out', chunk.toString('utf8'));
            });

            socket.on('server:console:in', (data: string) => {
                stream.write(data + '\n');
            });
        } catch (error: any) {
            socket.emit('error', error.message);
        }
    });

    // File Management
    socket.on('file:list', async ({ id, path }) => {
        try { const res = await FileService.listFiles(id, path); socket.emit('file:list', res); } catch (e: any) { socket.emit('error', e.message); }
    });

    socket.on('file:read', async ({ id, name }) => {
        try { const res = await FileService.readFile(id, name); socket.emit('file:read', res); } catch (e: any) { socket.emit('error', e.message); }
    });

    socket.on('file:write', async ({ id, name, content }) => {
        try { await FileService.writeFile(id, name, content); socket.emit('file:write:success'); } catch (e: any) { socket.emit('error', e.message); }
    });

    // Plugin Management
    socket.on('plugin:search', async (query) => {
        try { const res = await PluginService.searchPlugins(query); socket.emit('plugin:search', res); } catch (e: any) { socket.emit('error', e.message); }
    });

    socket.on('plugin:install', async ({ id, url, name }) => {
        try { await PluginService.installPlugin(id, url, name); socket.emit('plugin:install:success'); } catch (e: any) { socket.emit('error', e.message); }
    });

    // Backups
    socket.on('backup:create', async (id) => {
        try { const res = await BackupService.createBackup(id); socket.emit('backup:create:success', res); } catch (e: any) { socket.emit('error', e.message); }
    });

    socket.on('backup:list', async (id) => {
        try { const res = await BackupService.listBackups(id); socket.emit('backup:list', res); } catch (e: any) { socket.emit('error', e.message); }
    });

    socket.on('disconnect', () => {
        console.log('[DAEMON] Disconnected:', socket.id);
    });
});

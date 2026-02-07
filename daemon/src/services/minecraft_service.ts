import Docker from 'dockerode';
import path from 'path';
import fs from 'fs-extra';

const docker = new Docker();

export const createMinecraftServer = async (id: string, options: {
    memory: number,
    cpu: number,
    image: string,
    port: number,
    env: Record<string, string>
}) => {
    const serverPath = path.join(process.cwd(), 'data', id);
    await fs.ensureDir(serverPath);

    const container = await docker.createContainer({
        Image: options.image || 'itzg/minecraft-server',
        name: `aether-${id}`,
        Env: [
            'EULA=TRUE',
            ...Object.entries(options.env).map(([k, v]) => `${k}=${v}`)
        ],
        HostConfig: {
            Memory: options.memory * 1024 * 1024,
            CpuQuota: options.cpu * 1000,
            PortBindings: {
                '25565/tcp': [{ HostPort: options.port.toString() }]
            },
            Binds: [`${serverPath}:/data`]
        }
    });

    return container;
};

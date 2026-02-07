import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createServer = async (req: Request, res: Response) => {
    const { name, ownerId, nodeId, dockerImage, memory, cpu, disk, ports, envVars } = req.body;

    try {
        const server = await prisma.server.create({
            data: {
                name,
                ownerId,
                nodeId,
                dockerImage,
                memory,
                cpu,
                disk,
                ports: JSON.stringify(ports),
                envVars: JSON.stringify(envVars),
            },
        });
        res.json(server);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create server' });
    }
};

export const listServers = async (req: Request, res: Response) => {
    const servers = await prisma.server.findMany({
        include: { node: true, owner: true },
    });
    res.json(servers);
};

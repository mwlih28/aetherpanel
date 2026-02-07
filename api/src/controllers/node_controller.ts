import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const createNode = async (req: Request, res: Response) => {
    const { name, ip, port } = req.body;

    try {
        const token = crypto.randomBytes(32).toString('hex');
        const node = await prisma.node.create({
            data: { name, ip, port, token },
        });
        res.json(node);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create node' });
    }
};

export const listNodes = async (req: Request, res: Response) => {
    const nodes = await prisma.node.findMany();
    res.json(nodes);
};

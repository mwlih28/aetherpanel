import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await argon2.hash(password);
        const userCount = await prisma.user.count();

        // First user is ADMIN
        const role = userCount === 0 ? 'ADMIN' : 'USER';

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
        });

        res.json({ message: 'User created', userId: user.id });
    } catch (error: any) {
        console.error('[REGISTER-ERROR]', error?.message || error);
        res.status(400).json({ error: error.message?.includes('Unique constraint') ? 'Email or username already exists' : 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.warn(`[LOGIN-FAIL] User not found: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
            console.warn(`[LOGIN-FAIL] Invalid password for: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error: any) {
        console.error('[LOGIN-ERROR]', error?.message || error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

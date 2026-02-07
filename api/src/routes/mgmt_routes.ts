import { Router } from 'express';
import { createNode, listNodes } from '../controllers/node_controller';
import { createServer, listServers } from '../controllers/server_controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Node routes
router.post('/nodes', authMiddleware, adminMiddleware, createNode);
router.get('/nodes', authMiddleware, listNodes);

// Server routes
router.post('/servers', authMiddleware, adminMiddleware, createServer);
router.get('/servers', authMiddleware, listServers);

export default router;

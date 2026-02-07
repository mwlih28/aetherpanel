import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth_routes';
import mgmtRoutes from './routes/mgmt_routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // For easier SPA testing
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Logger for debugging auth issues
app.use((req, res, next) => {
    if (req.path.startsWith('/auth')) {
        console.log(`[AUTH-DEBUG] ${req.method} ${req.path}`, req.body);
    }
    next();
});

app.use('/auth', authRoutes);
app.use('/mgmt', mgmtRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Aetherpanel API is running', status: 'healthy' });
});

app.listen(port, () => {
    console.log(`[API] Server running on port ${port}`);
});

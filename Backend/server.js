import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import postRoute from './routes/postRoute.js';
import likeRoute from './routes/likesRoute.js';
import connectionRoute from './routes/ConnectionRoute.js';
import msgRoute from './routes/messagesRoute.js';
import userProfileRoute from './routes/userProfileRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server } from './utils/io.js';
import setupTables from './utils/setupTables.js';
dotenv.config();
const frontend_url = process.env.FRONTEND_URL;
const port = process.env.PORT||5000

app.use(cors({
    origin: [frontend_url],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use('/api', authRoute);
app.use('/like', likeRoute);
app.use('/msg', msgRoute);
app.use('/api', postRoute);
app.use('/api', connectionRoute);


app.use('/api', userProfileRoute);
app.get('/', (req, res) => {
    res.end("Hello World!");
});

async function startServer() {

    try {
        await setupTables();
        server.listen(port, () => {
            console.log(`Server running on port ${port} !`);
        });
    } catch (err) {
        console.error(' Failed to setup DB:', err);
        process.exit(1);
    }

}
startServer();
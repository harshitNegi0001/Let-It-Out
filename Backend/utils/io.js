import { Server } from 'socket.io';
import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
dotenv.config();
import db from './db.js';
export const app = express();
export const server = http.createServer(app);



const frontend_url = process.env.FRONTEND_URL;
const io = new Server(server, {
    cors: {
        origin: ["https://let-it-out-omega.vercel.app","http://localhost:5173"],
        credentials: true
    }
});

const userSocketMap = new Map();

io.on('connection', async (socket) => {
    const { userId } = socket.handshake.auth;
    userSocketMap.set(userId, socket.id);
    try {
        await db.query(
            `UPDATE users
            SET online_status = TRUE
            WHERE id=$1`,
            [userId]
        );
    } catch (err) {
        console.log(err);
    }
    // for typing event.
    socket.on('typing', ({ userId, receiverId }) => {
        const socket_id = userSocketMap.get(receiverId);
        if (socket_id) {
            socket.to(socket_id).emit('typing', { userId: userId });

        }

    });
    socket.on('stop_typing', async ({ userId, receiverId }) => {

        const socket_id = userSocketMap.get(receiverId);
        if (socket_id) {
            socket.to(socket_id).emit('stop_typing', { userId: userId });

        }

    })

    // for received msg.

    // for message seen.

    // for message send.

    // for follow req.

    // for other notifications.

    // console.log(`user with username ${username} is connected`);
    socket.on('disconnect', async () => {
        // console.log('user disconnected', username);
        try {
            userSocketMap.delete(userId);
            await db.query(
                `UPDATE users
                SET online_status = FALSE,
                last_login = CURRENT_TIMESTAMP
                WHERE id=$1`,
                [userId]
            );
        }
        catch (err) {
            console.log(err);
        }
    })
})
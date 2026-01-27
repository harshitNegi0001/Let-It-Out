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
        origin: [frontend_url],
        credentials: true
    }
});



io.on('connection', async (socket) => {
    const { userId } = socket.handshake.auth;
    try {
        await db.query(
            `UPDATE users
            SET online_status = TRUE,
            curr_socket_id = $1
            WHERE id=$2`,
            [socket.id, userId]
        );
    } catch (err) {
        console.log(err);
    }
    // for typing event.
    socket.on('typing', async ({ userId, receiverId }) => {
        const result = await db.query(
            `SELECT curr_socket_id
            FROM users
            WHERE id = $1`,
            [receiverId]
        );
        const socket_id = result.rows[0]?.curr_socket_id;

        socket.to(socket_id).emit('typing', { userId: userId });
    });
    socket.on('stop_typing', async({ userId, receiverId }) => {
        const result = await db.query(
            `SELECT curr_socket_id
            FROM users
            WHERE id = $1`,
            [receiverId]
        );
        const socket_id = result.rows[0]?.curr_socket_id;

        socket.to(socket_id).emit('stop_typing', { userId: userId });
    })
    // socket.broadcast.emit('typing',{userId});
    // for received msg.

    // for message seen.

    // for message send.

    // for follow req.

    // for other notifications.

    // console.log(`user with username ${username} is connected`);
    socket.on('disconnect', async () => {
        // console.log('user disconnected', username);
        try {
            await db.query(
                `UPDATE users
                SET online_status = FALSE,
                last_login = CURRENT_TIMESTAMP,
                curr_socket_id=null
                WHERE id=$1`,
                [userId]
            );
        }
        catch (err) {
            console.log(err);
        }
    })
})
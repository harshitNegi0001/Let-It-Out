import { Server } from 'socket.io';

import db from './db.js';




let io;
const userSocketMap = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://let-it-out-omega.vercel.app", "http://localhost:5173"],
            credentials: true
        }
    });



    io.on('connection', async (socket) => {
        const { userId } = socket.handshake.auth;
        if (!userId) {
            socket.disconnect();
            return;
        }
        if (!userSocketMap.has(userId)) {
            userSocketMap.set(userId, new Set());
            socket.broadcast.emit('add-online', { online_userId: userId });
        }
        userSocketMap.get(userId).add(socket.id);

        // send notification that missed when offline
        

        try {
            await db.query(
                `UPDATE users
            SET online_status = TRUE
            WHERE id=$1`,
                [userId]
            );

            const unReceived_msg = await db.query(
                `SELECT 
                    u.id AS id,
                    u.image AS image,
                    COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name,
                    u.lio_userid AS username,
                    COUNT(m.id) AS msg_count,
					ARRAY_AGG(m.id) AS msg_ids
                    
                FROM users AS u
                JOIN messages AS m
                ON m.sender_id = u.id
                    AND m.receiver_id = $1
                    AND m.is_delivered = false
                GROUP BY u.id
                
                    `,
                    [userId]
            );

            if(unReceived_msg.rows.length>0){
                io.to(socket.id).emit('offline_notification',{type:'chat',data:unReceived_msg.rows});
            }

        } catch (err) {
            console.log(err);
        }
        // for typing event.
        socket.on('typing', ({ userId, receiverId }) => {
            const receiverSockets = userSocketMap.get(receiverId);

            if (!receiverSockets) return;

            receiverSockets.forEach((socketId) => {
                io.to(socketId).emit('typing', { userId });
            });

        });
        socket.on('stop_typing', async ({ userId, receiverId }) => {

            const receiverSockets = userSocketMap.get(receiverId);

            if (!receiverSockets) return;

            receiverSockets.forEach((socketId) => {
                io.to(socketId).emit('stop_typing', { userId });
            });

        });

        socket.on('msg_seen', ({ receiverId, userId, msgIds }) => {
            // db handle here
            msgIds.map(async (id) => {
                try {
                    await db.query(
                        `UPDATE messages
                        SET is_read = TRUE
                        WHERE id =$1`,
                        [id]
                    )
                } catch (err) {
                    console.log(err);
                }
            });
            const receiverSockets = userSocketMap.get(receiverId);
            if (!receiverSockets) return;
            receiverSockets.forEach((socketId) => {
                io.to(socketId).emit('user_read_msg', { userId, msgIds });
            });
        })

        socket.on('msg_received', ({ receiverId, userId, msgIds }) => {
            // db handle here


            msgIds.map(async (id) => {
                try {
                    await db.query(
                        `UPDATE messages
                        SET is_delivered = TRUE
                        WHERE id =$1`,
                        [id]
                    )
                } catch (err) {
                    console.log(err);
                }
            });
            const receiverSockets = userSocketMap.get(receiverId);
            if (!receiverSockets) return;
            receiverSockets.forEach((socketId) => {
                io.to(socketId).emit('user_get_msg', { userId, msgIds });
            });

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
                const sockets = userSocketMap.get(userId);
                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        userSocketMap.delete(userId);
                        socket.broadcast.emit('remove-online', { online_userId: userId });
                        await db.query(
                            `UPDATE users 
                            SET online_status = FALSE,
                                last_login = CURRENT_TIMESTAMP 
                            WHERE id=$1`,
                            [userId]
                        );
                    }
                }

            }
            catch (err) {
                console.log(err);
            }
        })
    })
    return io;
}

export { io, userSocketMap }
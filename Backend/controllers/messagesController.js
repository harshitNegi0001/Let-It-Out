import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';
import { io, userSocketMap } from '../utils/io.js';


class Messages {
    // Controller function to get chatlist related to current user.
    getChatlist = async (req, res) => {

        const userId = req.id;
        try {
            const result = await db.query(
                `SELECT *
                FROM (
                    SELECT DISTINCT ON (u.id)
                        u.id AS id,
                        u.fake_name,
                        u.first_name AS name,
                        u.image,
                        u.last_login,
                        u.online_status,
                        u.lio_userid AS username,
                        json_build_object(
                            'id', m.id,
                            'sender_id', m.sender_id,
                            'is_read', m.is_read,
                            'is_delivered', m.is_delivered,
                            'message', m.message,
                            'created_at', m.created_at
                     ) AS last_message,
                        m.id AS last_message_id
                    FROM users u
                    JOIN messages m
                     ON (u.id = m.sender_id OR u.id = m.receiver_id)
                    WHERE u.id != $1
                    AND (m.receiver_id = $1 OR m.sender_id = $1)
                    ORDER BY u.id, m.id DESC
                ) t
                ORDER BY last_message_id DESC;
`,
                [userId]
            );

            const getUnreadCount = async (sender_id) => {
                const count = await db.query(
                    `SELECT
                    COUNT(id)
                    FROM messages
                    WHERE sender_id =$1 AND receiver_id =$2 AND is_read = false`,
                    [sender_id, userId]
                )
                return count.rows[0].count;
            }
            const chatlist = await Promise.all(result.rows.map(async (u) => {
                return {
                    name: u.fake_name || u.name,
                    id: u.id,
                    username: u.username,
                    image: u.image,
                    last_message: u.last_message,
                    unread_count: await getUnreadCount(u.id),
                    online_status: u.online_status
                }
            }))



            return returnRes(res, 200, { message: 'Getting chatlist success', chatlist });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


    // Controller function to send message and insert message to db.
    sendMessage = async (req, res) => {
        const senderId = req.id;
        const { receiverId, message, replyTo } = req.body;

        try {
            const { rows } = await db.query(
                `
      INSERT INTO messages
      (
        sender_id,
        receiver_id,
        message,
        message_type,
        reply_to_msg
      )
      VALUES
      (
        $1, $2, $3, $4, $5
      )
      RETURNING
        id,
        sender_id,
        receiver_id,
        message,
        message_type,
        reply_to_msg,
        is_read,
        is_delivered,
        created_at,
        created_at :: date AS message_date
      ;
      `,
                [senderId, receiverId, message, "text", replyTo]
            );

            const msg = rows[0];
            const wrappedMessage = {
                message_date: msg.message_date,
                messages: [msg]
            }
            const result = await db.query(
                `SELECT 
                u.lio_userid AS username,
                u.id AS id,
                u.image AS image,
                m.message AS message,
                m.id AS msg_id,
                COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name
                FROM users AS u
                JOIN messages AS m
                ON m.sender_id=u.Id
                WHERE m.id = $1`,
                [msg.id]
            );
            const receiverSockets = userSocketMap.get(receiverId);

            if (receiverSockets) {
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit('receive_msg', { wrappedMessage: wrappedMessage });
                    io.to(socketId).emit('get_notify', {
                        data: {
                            type: 'chat',
                            data: result.rows[0]
                        }
                    })

                })
            }
            return returnRes(res, 200, {
                wrappedMessage
            });

        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    };


    // Controller function for getting messages within chat.
    getMessages = async (req, res) => {
        const user1 = req.id;
        const user2 = req.body?.userId;
        try {

            const result = await db.query(
                `SELECT
                msg_date AS message_date,
                    json_agg(
                        json_build_object(
                        'id', id,
                        'sender_id', sender_id,
                        'receiver_id', receiver_id,
                        'message', message,
                        'is_read', is_read,
                        'is_delivered', is_delivered,
                        'created_at', created_at
                        )
                    ORDER BY created_at
                    ) AS messages
                FROM (
                SELECT *,
                   created_at :: date AS msg_date
                   FROM messages
                   WHERE
                   (sender_id = $1 AND receiver_id = $2)
                   OR
                   (sender_id = $2 AND receiver_id = $1)
                ) t
                GROUP BY msg_date
                ORDER BY msg_date DESC;`,
                [user1, user2]
            );

            await db.query(
                `UPDATE messages
                SET is_read = true, is_delivered = true
                WHERE receiver_id = $1 AND sender_id = $2 AND is_read!= true`,
                [user1, user2]
            );
            const receiverSockets = userSocketMap.get(user2);
            if (receiverSockets) {
                receiverSockets.forEach(socketId => {
                    io.to(socketId).emit('user_read_msg', {
                        userId: user1
                    });
                })
            }
            return returnRes(res, 200, { messagesList: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
    // controller function to get user's data for opened chat.

    getUserBasicData = async (req, res) => {
        const visitorId = req.id;
        const { username } = req.query;
        try {
            // other checkup here....
            const result = await db.query(
                `SELECT
                u.id AS id,
                u.lio_userid AS username,
                u.image AS image,
                u.online_status AS online_status,
                u.last_login AS last_login,
                COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name,
                EXISTS(
                    SELECT 1
                    FROM blocked_accounts AS b1
                    WHERE b1.blocker_id = $1
                        AND b1.blocked_id = u.id
                ) AS is_blocked,
                EXISTS(
                    SELECT 1
                    FROM blocked_accounts AS b2
                    WHERE b2.blocker_id = u.id
                        AND b2.blocked_id = $1
                ) AS blocked_me
                FROM users AS u
                WHERE u.lio_userid = $2
                `, [visitorId, username]
            );

            if (result.rows.length == 0) {
                return returnRes(res, 404, { error: 'User not found.', code: 'USER_NOT_FOUND' });
            }

            return returnRes(res, 200, { message: 'Got user basic detail for chat.', userDetail: result.rows[0] });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // controller function to get connected user for chatting.

    getConnectedUsers = async (req, res) => {
        const userId = req.id;

        try {
            const result = await db.query(
                `SELECT DISTINCT
                    u.id AS id,
                    COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name,
                    u.lio_userid AS username,
                    u.image AS image
                FROM followers f
                JOIN users u
                ON u.id = CASE
                    WHEN f.follower_id = $1 THEN f.following_id
                    ELSE f.follower_id
                END
                WHERE
                f.status = 'accepted'
                AND ($1 IN (f.follower_id, f.following_id))
                AND u.id <> $1;
                `,
                [userId]
            );

            return returnRes(res, 200, { connectedUsers: result.rows });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // controller function to help getting unread messages/notification count
    getUnreadChatId = async (req, res) => {
        const userId = req.id;
        try {   
            const result = await db.query(
                `SELECT
                sender_id
                FROM messages
                WHERE receiver_id =$1
                    AND is_read = FALSE
                GROUP BY sender_id`,
                [userId]
            );
            const notifications=await db.query(
                `SELECT COUNT(id)
                FROM notifications
                WHERE is_read=FALSE
                    AND receiver_id=$1`,
                [userId]
            )
            const chatIds = result.rows.map(r=>r.sender_id);
            return returnRes(res,200,{notifData:{chatIds,notificationCount:notifications.rows?.[0].count||0}});

        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Messages();
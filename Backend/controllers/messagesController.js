import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

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
                    unread_count: await getUnreadCount(u.id)
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
            const result = await db.query(
                `INSERT INTO messages
                (
                    sender_id,
                    receiver_id,
                    message,
                    message_type,
                    reply_to_msg

                )
                VALUES 
                (
                    $1,$2,$3,$4,$5
                )
                RETURNING *;`,
                [senderId, receiverId, message, "text", replyTo]
            );

            return returnRes(res, 200, { message: 'Sent.', sentMessage: result.rows[0] });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function for getting messages within chat.
    getMessages = async (req, res) => {
        const user1 = req.id;
        const user2 = req.body?.userId;

        try {

            const result = await db.query(
                `SELECT 
                    DATE(created_at) AS message_date,
                    json_agg(
                        json_build_object(
                            'id', id,
                            'sender_id', sender_id,
                            'receiver_id', receiver_id,
                            'message', message,
                            'is_read',is_read,
                            'is_delivered',is_delivered,
                            'created_at', created_at
                        )
                        ORDER BY created_at
                    ) AS messages
	
                FROM messages
                WHERE 
                    (sender_id = $1 AND receiver_id = $2)
                    OR
                    (sender_id = $2 AND receiver_id = $1)
                GROUP BY DATE(created_at)
                ORDER BY message_date;`,
                [user1, user2]
            );

            await db.query(
                `UPDATE messages
                SET is_read = true, is_delivered = true
                WHERE receiver_id = $1 AND sender_id = $2 AND is_read!= true`,
                [user1, user2]
            );

            return returnRes(res, 200, { messagesList: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Messages();
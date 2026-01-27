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
        DATE(created_at AT TIME ZONE 'UTC') AS message_date
      ;
      `,
                [senderId, receiverId, message, "text", replyTo]
            );

            const msg = rows[0];

            // 👇 SAME FORMAT AS getMessages
            return returnRes(res, 200, {
                wrappedMessage: {
                    message_date: msg.message_date,
                    messages: [msg]
                }
            });

        } catch (err) {
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
                   DATE(created_at AT TIME ZONE 'UTC') AS msg_date
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
            return returnRes(res, 200, { messagesList: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
    // controller function to get user's data for opened chat.

    getUserBasicData = async (req, res) => {
        const visitorId = req.id;
        const {username} = req.query;
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
                `,[visitorId,username]
            );

            return returnRes(res,200,{message:'Got user basic detail for chat.',userDetail:result.rows[0]});
        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Messages();
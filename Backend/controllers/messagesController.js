import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Messages {
    // Controller function to get chatlist related to current user.
    getChatlist = async (req, res) => {

        const userId = req.id;
        try {
            const result = await db.query(
                `SELECT 
                id, 
                lio_userid AS username,
                fake_name,
                first_name as name,
                image
                FROM users
                WHERE id != $1;`,
                [userId]
            );

            const chatlist = result.rows.map(u => {
                return {
                    name: u.fake_name || u.name,
                    id: u.id,
                    username: u.username,
                    image: u.image
                }
            })


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
        const user1=  req.id;
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
                [user1,user2]
            );

            await db.query(
                `UPDATE messages
                SET is_read = true, is_delivered = true
                WHERE receiver_id = $1 AND sender_id = $2 AND is_read!= true`,
                [user1,user2]
            );

            return returnRes(res,200,{messagesList:result.rows});
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Messages();
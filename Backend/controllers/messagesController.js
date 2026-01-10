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
                name,
                image
                FROM users;`
            );
            const chatlist =  result.rows.filter(u=>u.id!=userId);
            return returnRes(res, 200, { message: 'Getting chatlist success', chatlist});
        } catch (err) {
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


    // Controller function to send message and insert message to db.
    sendMessage = async (req, res) => {

        const senderId = req.id;
        const {receiverId,message,replyTo} = req.body;
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
                [senderId,receiverId,message,"text",replyTo]
            );

            return returnRes(res,200,{message:'Sent.',sentMessage:result.rows[0]});
        } catch (err) {
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Messages();
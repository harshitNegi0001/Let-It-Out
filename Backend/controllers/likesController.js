import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Likes {
    // Controller function to like a post
    likeTarget = async (req, res) => {
        const userId = req.id;
        const { targetId, targetName } = req.body;

        try {
            const result = await db.query(
                `INSERT INTO 
                likes
                (
                    user_id,
                    target_id,
                    target_type
                )
                VALUES
                (
                    $1,$2,$3
                ) RETURNING id`,
                [userId, targetId, targetName]
            )






            return returnRes(res, 200, { messages: `${targetName} liked.` });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    deleteLikeTarget = async (req, res) => {
        const userId = req.id;
        const { targetId, targetName } = req.body;
        try {
            const result = await db.query(
                `DELETE 
                FROM likes
                WHERE user_id=$1
                    AND target_id=$2
                    AND target_type=$3`,
                [userId, targetId, targetName]
            )






            return returnRes(res, 200, { messages: `deleted ${targetName} like.` });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    // controller function to add posts in not interested list.

    addNotInterestedPost = async (req, res) => {
        const userId = req.id;
        const {post_id} =req.body;

        try {
            await db.query(
                `INSERT INTO not_interested_posts
                (
                    post_id,
                    user_id
                )
                VALUES(
                    $1,$2
                )
                ON CONFLICT (post_id, user_id) DO NOTHING`,
                [post_id,userId]
            );

            return returnRes(res,200,{message:'Post marked as not interested.'});
        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}


export default new Likes();
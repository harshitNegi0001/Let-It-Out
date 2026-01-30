import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Comment {

    // controller function add comment on a post or reply on comment.
    addComment = async (req, res) => {
        const userId = req.id;
        const { content, parentId, postId } = req.body;
        try {
            const result = await db.query(
                `INSERT INTO 
                comments
                (
                    user_id,
                    post_id,
                    parent_id,
                    content
                )
                VALUES(
                    $1,$2,$3,$4
                )
                RETURNING *`,
                [userId, postId, parentId, content]
            );

            return returnRes(res,200,{message:'Comment posted.', commentData:result.rows[0]});
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


}

export default new Comment();
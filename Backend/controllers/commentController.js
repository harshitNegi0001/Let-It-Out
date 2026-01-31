import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Comment {

    // controller function add comment on a post or reply on comment.
    addComment = async (req, res) => {
        const userId = req.id;
        const { content, parentId, postId, replying_to } = req.body;
        try {
            const result = await db.query(
                `INSERT INTO 
                comments
                (
                    user_id,
                    post_id,
                    parent_id,
                    content,
                    replying_to
                )
                VALUES(
                    $1,$2,$3,$4,$5
                )
                RETURNING id`,
                [userId, postId, parentId, content, replying_to]
            );
            const cmntId = result.rows[0].id;
            const commentData = await db.query(
                `SELECT 
                    c.id AS id,
                    c.post_id AS post_id,
                    c.parent_id AS parent_id,
                    c.replying_to AS replying_to,
                    c.content AS content,
                    EXISTS(
                        SELECT 1
                        FROM likes AS l
                        WHERE l.user_id =$2
                            AND l.target_id =c.id
                            AND l.target_type='comment'
                    ) AS is_liked,
                    (
                        SELECT COUNT(l2.id)
                        FROM likes AS l2
                        WHERE l2.target_id=c.id
                            AND l2.target_type='comment'
                    ) AS likes_count,
                    (
                        SELECT COUNT(c2.id)
                        FROM comments AS c2
                        WHERE c2.parent_id=c.id
                    ) AS comments_count,
                    (
                        SELECT
                        json_build_object(
                            'id',u.id ,
                            'image',u.image,
                            'username',u.lio_userid,
                            'name',COALESCE(NULLIF(u.fake_name,''),u.first_name)
                        )
                        FROM users AS u
                        WHERE c.user_id = u.id
                    ) AS user_data,
                    c.is_edited AS is_edited,
                    c.updated_at AS updated_at,
                    c.created_at AS created_at

                    FROM comments AS c
                    WHERE c.id =$1
                `,
                [cmntId, userId]
            )

            return returnRes(res, 200, { message: 'Comment posted.', commentData: commentData.rows[0] });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // controller function to get comments.
    getComments = async (req, res) => {
        const visitorId = req.id;
        const { post_id, parent_id } = req.query;
        
        try {
            if (parent_id) {
                const result = await db.query(
                    `SELECT 
                    c.id AS id,
                    c.post_id AS post_id,
                    c.parent_id AS parent_id,
                    c.replying_to AS replying_to,
                    c.content AS content,
                    EXISTS(
                        SELECT 1
                        FROM likes AS l
                        WHERE l.user_id =$2
                            AND l.target_id =c.id
                            AND l.target_type='comment'
                    ) AS is_liked,
                    (
                        SELECT COUNT(l2.id)
                        FROM likes AS l2
                        WHERE l2.target_id=c.id
                            AND l2.target_type='comment'
                    ) AS likes_count,
                    (
                        SELECT COUNT(c2.id)
                        FROM comments AS c2
                        WHERE c2.parent_id=c.id
                    ) AS comments_count,
                    (
                        SELECT
                        json_build_object(
                            'id',u.id ,
                            'image',u.image,
                            'username',u.lio_userid,
                            'name',COALESCE(NULLIF(u.fake_name,''),u.first_name),
                            'following_status',(
                                SELECT 
                                    f.status
                                FROM followers AS f
                                WHERE follower_id =$2
                                    AND following_id=u.id
                            )
                        )
                        FROM users AS u
                        WHERE c.user_id = u.id
                    ) AS user_data,
                    c.is_edited AS is_edited,
                    c.updated_at AS updated_at,
                    c.created_at AS created_at

                    FROM comments AS c
                    WHERE c.parent_id = $1`,
                    [parent_id, visitorId]
                );
                return returnRes(res, 200, { commentsList: result.rows });

            }
            else {
                const result = await db.query(
                    `SELECT 
                    c.id AS id,
                    c.post_id AS post_id,
                    c.parent_id AS parent_id,
                    c.replying_to AS replying_to,
                    c.content AS content,
                    EXISTS(
                        SELECT 1
                        FROM likes AS l
                        WHERE l.user_id =$2
                            AND l.target_id =c.id
                            AND l.target_type='comment'
                    ) AS is_liked,
                    (
                        SELECT COUNT(l2.id)
                        FROM likes AS l2
                        WHERE l2.target_id=c.id
                            AND l2.target_type='comment'
                    ) AS likes_count,
                    (
                        SELECT COUNT(c2.id)
                        FROM comments AS c2
                        WHERE c2.parent_id=c.id
                    ) AS comments_count,
                    (
                        SELECT
                        json_build_object(
                            'id',u.id ,
                            'image',u.image,
                            'username',u.lio_userid,
                            'name',COALESCE(NULLIF(u.fake_name,''),u.first_name),
                            'following_status',(
                                SELECT 
                                    f.status
                                FROM followers AS f
                                WHERE follower_id =$2
                                    AND following_id=u.id
                            )
                        )
                        FROM users AS u
                        WHERE c.user_id = u.id
                    ) AS user_data,
                    c.is_edited AS is_edited,
                    c.updated_at AS updated_at,
                    c.created_at AS created_at

                    FROM comments AS c
                    WHERE c.post_id = $1
                        AND c.parent_id IS NULL`,
                    [post_id, visitorId]
                );
                return returnRes(res, 200, { commentsList: result.rows });
            }
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


}

export default new Comment();
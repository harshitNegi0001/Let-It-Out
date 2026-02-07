import { returnRes } from '../utils/returnRes.js';
import db from '../utils/db.js';
import { io, userSocketMap } from '../utils/io.js';


class Notification {
    // controller function to get notifications.
    getNotification = async (req, res) => {
        const receiver_id = req.id;
        const {limit,lastNotifTime} = req.query;
        try {
            const result = await db.query(
                `SELECT n.*,
                u.image AS image,
                u.lio_userid AS username,
                COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name,
				json_build_object(
					'id',p.id,
					'post_type',p.post_type,
					'media_url',p.media_url , 
					'content',p.content 
				) AS post_data,
				json_build_object(
					'id',c.id,
					'content',c.content,
					'post_id',c.post_id
				) AS comment_data
                FROM notifications AS n
                JOIN users AS u
                ON n.actor_id = u.id
                LEFT JOIN posts AS p
				ON n.target_type='post'
					AND n.target_id=p.id
				LEFT JOIN comments AS c
				ON n.target_type='comment'
					AND n.target_id=c.id
                WHERE n.receiver_id=$1
                    AND ($2 :: TIMESTAMPTZ IS NULL OR n.updated_at<$2)
                ORDER BY n.updated_at DESC
                LIMIT $3`,
                [receiver_id,lastNotifTime,limit]
            );
            if (result.rows.length == 0) {
                return returnRes(res, 200, { notifications: [] });
            }
            const notif_id = result.rows.map(r => r.id);
            await db.query(
                `UPDATE notifications
                SET is_read = TRUE
                WHERE id = ANY($1)`,
                [notif_id]
            )

            return returnRes(res, 200, { notifications: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function to notifying about like and comments
    addLikeCommentNotification = async (target_type, target_id, actor_id, type) => {
        try {
            const table = target_type == 'post' ? 'posts' : 'comments'
            const result = await db.query(
                `SELECT 
                    user_id
                FROM ${table}
                WHERE id =$1`,
                [target_id]
            );

            if (result.rows.length == 0) {
                throw new Error("Target not found");
            }

            const receiver_id = result.rows[0].user_id;
            if (receiver_id == actor_id) {
                return;
            }

            const socket_ids = userSocketMap.get(receiver_id);
            if (socket_ids) {
                socket_ids.forEach((socketId) => {
                    io.to(socketId).emit('get_notify', {
                        data: {
                            type: 'notification'
                        }
                    })
                })
            }
            const isAlready = await db.query(
                `
                   
                        SELECT id
                        FROM notifications 
                        WHERE receiver_id = $1
                            AND type =$2
                            AND target_id =$3
                            AND target_type =$4
                            AND DATE(created_at) = CURRENT_DATE
                    
                `,
                [receiver_id, type, target_id, target_type]
            )


            const alreadyExists = isAlready.rows.length != 0;
            if (alreadyExists) {
                // update
                await db.query(
                    `UPDATE notifications
                    SET 
                        actor_id=$1,
                        is_read = FALSE,
                        count=count+1,
                        updated_at = now()
                    WHERE id=$2`,
                    [actor_id, isAlready.rows[0].id]
                );

                // trigger socket emit to send live notification.
            }
            else {
                // create
                await db.query(
                    `INSERT INTO notifications
                    (
                        receiver_id,
                        type,
                        actor_id,
                        target_id,
                        target_type
                    )
                    VALUES(
                        $1,$2,$3,$4,$5
                    )`,
                    [receiver_id, type, actor_id, target_id, target_type]
                );

                // notify user.
            }

        } catch (err) {
            // console.log(err);
            throw err;
        }
    }

    // controller function to notify about followers/following
    addFollowNotification = async (type, actor_id, receiver_id, is_read) => {
        try {
            if (is_read && type == 'follow') {
                // delete request notification form there.
                await db.query(
                    `DELETE FROM notifications
                    WHERE receiver_id =$1
                        AND type ='follow_req'
                        AND actor_id = $2`,
                    [receiver_id, actor_id]
                );
            }
            else {
                const socket_ids = userSocketMap.get(receiver_id);
                if (socket_ids) {
                    socket_ids.forEach((socketId) => {
                        io.to(socketId).emit('get_notify', {
                            data: {
                                type: 'notification'
                            }
                        })
                    })
                }
            }
            if (type == 'follow_req') {
                await db.query(
                    `INSERT INTO notifications
                    (
                        receiver_id,
                        actor_id,
                        type
                    )
                    VALUES(
                        $1,$2,$3
                    )`,
                    [receiver_id, actor_id, type]
                )


                return;
            }
            const isAlready = await db.query(
                `
                   
                        SELECT id
                        FROM notifications 
                        WHERE receiver_id = $1
                            AND type =$2
                            AND DATE(created_at)=CURRENT_DATE
                    
                `,
                [receiver_id, type]
            )

            const alreadyExists = isAlready.rows.length != 0;
            if (alreadyExists) {
                await db.query(
                    `UPDATE notifications
                    SET is_read = $3,
                        actor_id=$1,
                        updated_at = now(),
                        count = count+1
                    WHERE id =$2`,
                    [actor_id, isAlready.rows[0]?.id, is_read]
                )

                // socket emit here
            }
            else {
                await db.query(
                    `INSERT INTO notifications
                    (
                        receiver_id,
                        actor_id,
                        type
                    )
                    VALUES(
                        $1,$2,$3
                    )`,
                    [receiver_id, actor_id, type]
                )
            }

        } catch (err) {
            // console.log(err);
            throw err;
        }
    }
}

export default new Notification();
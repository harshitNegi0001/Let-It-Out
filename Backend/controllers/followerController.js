import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Followers {

    // controller function to send or cancel following request.

    requestToFollow = async (req, res) => {
        const follower_id = req.id;
        const { following_id, operation } = req.body;
        try {

            if (follower_id == following_id) {
                return returnRes(res, 404, { error: "Can't follow your own account." });
            }

            const isUserExists = await db.query(
                `SELECT acc_type
                FROM users
                WHERE id = $1`,
                [following_id]
            );
            if (isUserExists.rows.length == 0) {
                return returnRes(res, 404, { error: 'User not found.' });
            }
            if (operation == 'cancel') {
                await db.query(
                    `DELETE FROM followers
                    WHERE follower_id =$1 AND following_id =$2`,
                    [follower_id, following_id]
                )
                return returnRes(res, 200, { messages: 'unfollowed', followingStatus: 'not_followed' });

            }
            const isPrivateAcc = isUserExists.rows[0].acc_type == 'private'

            await db.query(
                `INSERT INTO followers
                    (
                        follower_id,
                        following_id,
                        status
                    )
                    VALUES (
                        $1,$2,$3
                    )
                    ON CONFLICT (follower_id, following_id) DO NOTHING`,
                [follower_id, following_id, isPrivateAcc ? 'pending' : 'accepted']
            );

            return returnRes(res, 200, { message: isPrivateAcc ? 'Requested' : 'Following', followingStatus: isPrivateAcc ? 'pending' : 'accepted' });



        } catch (err) {

            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function to get followers or followings list and reqests for following.
    getConnectivityList = async (req, res) => {
        const visitorId = req.id;
        const { username, list_type } = req.query;
        try {
            const user = await db.query(
                `SELECT
                    id,
                    lio_userid as username,
                    COALESCE(NULLIF(fake_name, ''), first_name) AS name,
                    acc_type,
                    acc_status
                FROM users
                WHERE lio_userid = $1`
                , [username]
            );

            if (user.rows.length == 0) {
                return returnRes(res, 200, {
                    message: 'User not found',
                    restriction: {
                        isRestricted: true,
                        reason: 'USER_NOT_FOUND'
                    }
                });
            }
            const basicDetail = {
                name: user.rows[0].name,
                username: user.rows[0].username
            }
            const userId = user.rows[0].id;
            const acc_status = user.rows[0].acc_status;
            if (acc_status != 'active') {
                return returnRes(res, 200, {
                    messages: `This account has been ${acc_status == 'deactive' ? 'Deactivated' : 'Suspended'}`,
                    basicDetail: basicDetail,
                    restriction: {
                        isRestricted: true,
                        reason: acc_status == 'deactive' ? 'DEACTIVATED_ACCOUNT' : 'SUSPENDED_ACCOUNT'
                    }
                })
            }
            const acc_type = user.rows[0].acc_type;

            const followerResult = await db.query(
                `SELECT 
                    1
                FROM followers
                WHERE follower_id=$1
                    AND following_id=$2
                    AND status ='accepted'
                `,
                [visitorId, userId]
            )
            const isFollowing = followerResult.rows.length > 0;

            if (visitorId == userId || isFollowing || acc_type != 'private') {
                if (list_type == 'followings') {
                    const users_list = await db.query(
                        `SELECT 
                            u.id AS id,
                            COALESCE(NULLIF(u.fake_name, ''), u.first_name) AS name,
                            u.lio_userid AS username,
                            u.image AS image,
                            u.bio AS bio,
                            (
                                SELECT 
                                    status
                                FROM followers AS f2
                                WHERE f2.follower_id =$1
                                    AND f2.following_id =u.id
                            ) AS followingStatus,
                            EXISTS (
                                SELECT 1
                                FROM followers AS f3
                                WHERE f3.follower_id = u.id
                                    AND f3.following_id =$1
									AND f3.status='accepted'
                            ) AS isFollower

                        FROM followers AS f
                        JOIN users AS u
                        ON u.id = f.following_id
                        WHERE f.follower_id = $2
                            AND f.status = 'accepted'

                        `,
                        [visitorId, userId]
                    )

                    return returnRes(res, 200, {
                        user_list: users_list.rows,
                        basicDetail: basicDetail,
                        message: 'Fetched followings list.'
                    })
                }
                else {
                    const users_list = await db.query(
                        `SELECT 
                            u.id AS id,
                            COALESCE(NULLIF(u.fake_name, ''), u.first_name) AS name,
                            u.lio_userid AS username,
                            u.image AS image,
                            u.bio AS bio,
                            (
                                SELECT 
                                    status
                                FROM followers AS f2
                                WHERE f2.follower_id =$1
                                    AND f2.following_id =u.id
                            ) AS followingStatus,
                            EXISTS (
                                SELECT 1
                                FROM followers AS f3
                                WHERE f3.follower_id = u.id
                                    AND f3.following_id =$1
									AND f3.status='accepted'
                            ) AS isFollower

                        FROM followers AS f
                        JOIN users AS u
                        ON u.id = f.follower_id
                        WHERE f.following_id = $2
                            AND f.status = 'accepted'
                        `,
                        [visitorId, userId]
                    )

                    if (visitorId == userId) {
                        const follower_req = await db.query(
                            `
                            SELECT 
                                f.id AS req_id,
                                u.id AS id,
                                COALESCE(NULLIF(u.fake_name, ''), u.first_name) AS name,
                                u.lio_userid AS username,
                                u.image AS image,
                                u.bio AS bio,
                                (
                                    SELECT 
                                        status
                                    FROM followers AS f2
                                    WHERE f2.follower_id =$1
                                        AND f2.following_id =u.id
                                ) AS followingStatus

                            FROM followers AS f
                            JOIN users AS u
                            ON u.id=f.follower_id
                            WHERE f.following_id=$1
                                AND f.status ='pending'
                            `,
                            [visitorId]
                        );
                        return returnRes(res, 200, {
                            user_list: users_list.rows,
                            basicDetail: basicDetail,
                            requests_list: follower_req.rows,
                            message: 'Fetched followings list.'
                        })
                    }

                    return returnRes(res, 200, {
                        user_list: users_list.rows,
                        basicDetail: basicDetail,
                        message: 'Fetched followings list.'
                    })

                }
            }

            return returnRes(res, 200, {
                message: `Follow user to see their ${list_type}`,
                basicDetail: basicDetail,
                restriction: {
                    isRestricted: true,
                    reason: 'PRIVATE_ACCOUNT'
                }
            })


        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    // Controller function to accept or reject follower request.
    handleFollowReq = async (req, res) => {
        const following_id = req.id;
        const { reqId, operation } = req.body;
        try {
            const follower_id_check = await db.query(
                `SELECT(
                    EXISTS(
                        SELECT 1
                        FROM followers
                        WHERE id=$1
                            AND following_id =$2
                    )
                )`,
                [reqId, following_id]
            );

            if(!follower_id_check.rows[0]?.exists){
                return returnRes(res,403,{error:`You haven't permission.`});
            }
            if(operation=='accept'){
                const result = await db.query(
                    `UPDATE followers
                    SET status = 'accepted'
                    WHERE id=$1
                    `,[reqId]
                );
                return returnRes(res,200,{message:'Request Accepted.',status:'ACCEPTED'});

            }
            if(operation=='reject'){
                await db.query(
                    `DELETE FROM followers
                    WHERE id =$1`,
                    [reqId]
                );

                return returnRes(res,200,{message:'Request Rejected.',status:'REJECTED'});

            }
            return returnRes(res, 400, { error: 'Operation can be only accept or reject.' });

        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}



export default new Followers();
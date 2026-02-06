
import { returnRes } from "../utils/returnRes.js";
import db from "../utils/db.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

class Post {
    // Controller function for creating post
    createPost = async (req, res) => {
        const userId = req.id;

        try {
            const { content = "", post_type, mood } = req.body;
            const files = req.files || [];

            if (!content.trim() && files.length === 0) {
                return returnRes(res, 400, { error: "Post cannot be empty" });
            }

            let mediaUrls = [];

            if (files.length > 0) {
                const uploadPromises = files.map(file => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "posts" },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result.secure_url);
                            }
                        );

                        streamifier.createReadStream(file.buffer).pipe(stream);
                    });
                });

                mediaUrls = await Promise.all(uploadPromises);
            }

            let finalPostType = "text";
            if (mediaUrls.length > 0 && content.trim()) finalPostType = "mixed";
            else if (mediaUrls.length > 0) finalPostType = "image";



            const result = await db.query(
                `INSERT INTO posts (user_id, content, media_url, post_type, mood_tag)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *`,
                [
                    userId,
                    content.trim() || null,
                    mediaUrls.length > 0 ? mediaUrls : null,
                    finalPostType,
                    mood
                ]
            );

            return returnRes(res, 201, {
                message: "Post created successfully",
                post: result.rows[0]
            });

        } catch (err) {
            // console.error(err);
            return returnRes(res, 500, { error: "Internal Server Error!" });
        }
    };

    // controller function to get posts of a specific profile
    getProfilePost = async (req, res) => {

        const visiterId = req.id;
        const { userId, limit, currPage, reqType = "posts",lastFeedId } = req.query;

        try {

            const user = await db.query(
                `SELECT 
                id,
                fake_name,
                lio_userid as username,
                image,
                first_name,
                online_status,
                acc_status,
                acc_type
                FROM users
                WHERE id = $1`,
                [userId]
            );


            if (user.rows.length == 0) {
                return returnRes(res, 404, { error: 'User not found.' });
            }

            const userDetail = user.rows[0];
            const blocklist_check = await db.query(
                `SELECT(
                    EXISTS(
                        SELECT 1
                        FROM blocked_accounts
                        WHERE (blocker_id = $1 AND blocked_id =$2)
                            OR (blocker_id=$2 AND blocked_id = $1)
                    )
                )`,
                [visiterId, userId]
            );
            if (blocklist_check.rows[0]?.exists) {
                return returnRes(res, 200, {
                    user: {
                        id: userDetail.id,
                        username: userDetail.username,
                        acc_status: userDetail.acc_status,
                        acc_type: userDetail.acc_type
                    },
                    restrictions: {
                        show_posts: false,
                        reason: "ACCOUNT_BLOCKED",
                        message: "Either you has been blocked or you blocked this user."
                    }
                });
            }
            if (userDetail.acc_status == 'deactive') {
                return returnRes(res, 200, {
                    user: {
                        id: userDetail.id,
                        username: userDetail.username,
                        acc_status: "deactive",
                        acc_type: userDetail.acc_type
                    },
                    restrictions: {
                        show_posts: false,
                        reason: "ACCOUNT_DEACTIVATED",
                        message: "This account is temporarily deactivated"
                    }
                });
            }
            if (userDetail.acc_status == 'suspended') {
                return returnRes(res, 200, {
                    user: {
                        id: userDetail.id,
                        username: userDetail.username,
                        acc_status: "suspended",
                        acc_type: userDetail.acc_type
                    },
                    restrictions: {
                        show_posts: false,
                        reason: "ACCOUNT_SUSPENDED",
                        message: "This account is temporarily suspended"
                    }
                });
            }
            if (userId == visiterId) {
                if (reqType == 'posts') {
                    const result = await db.query(
                        `SELECT 
                    p.*
                    ,count(l.id) AS likes_count,
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    ) AS comments_count,
                    EXISTS(
                        SELECT 1
                        FROM likes AS l2
                        WHERE l2.target_type = 'post'
                            AND l2.target_id = p.id
                            AND l2.user_id = $1
                    ) AS is_liked,
					EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $1
							AND b.post_id=p.id
					) AS is_saved
                    FROM posts AS p
                    LEFT JOIN likes AS l
                    ON p.id=l.target_id AND l.target_type='post'
                    WHERE p.user_id = $1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    GROUP BY p.id
                    ORDER BY id DESC
                    LIMIT $3`
                        , [userId, lastFeedId, limit]
                    );

                    return returnRes(res, 200, { message: 'Success', posts: result.rows });
                }


                else if (reqType == 'saved_posts') {
                    const result = await db.query(
                        `SELECT 
                            json_build_object(
                            'id', p.id,
                            'user_id', p.user_id,
                            'content', p.content,
                            'mood_tag', p.mood_tag,
                            'media_url', p.media_url,
                            'post_type', p.post_type,
                            'likes_count',count(l.id),
                            'share_count', p.shares_count,
                            'created_at', p.created_at,
                            'is_liked', EXISTS(
                                SELECT 1
                                FROM likes l2
                                WHERE l2.target_id = p.id
                                    AND l2.target_type = 'post'
                                    AND l2.user_id = $1
                            ),
					        'is_saved',EXISTS(
						        SELECT 1
						        FROM bookmarks as b
						        WHERE b.user_id = $1
						        	AND b.post_id=p.id
					        ),
                            'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            ) 
                        ) AS post_data, 
                        json_build_object(
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image


                        ) AS user_data
                        FROM posts AS p
                        JOIN bookmarks AS b
                        ON b.post_id =p.id AND b.user_id = $1
                        JOIN users AS u
                        ON u.id = p.user_id 
                        LEFT JOIN likes AS l
                        ON l.target_id = p.id AND l.target_type ='post'
                        WHERE ($2 :: BIGINT IS NULL OR p.id < $2)
                        GROUP BY p.id,u.id
                        ORDER BY p.id DESC
                        limit $3;`
                        , [visiterId, lastFeedId, limit]
                    );


                    return returnRes(res, 200, { message: 'Success', posts: result.rows });
                }
                else if (reqType == 'replied_post') {
                const result = await db.query(
                    `SELECT 
                    json_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'content', p.content,
                    'mood_tag', p.mood_tag,
                    'media_url', p.media_url,
                    'post_type', p.post_type,
                    'likes_count',(
                    SELECT COUNT(l1.id)
                    FROM likes AS l1
                    WHERE l1.target_id=p.id
                        AND l1.target_type='post'
                    ),
                    'share_count', p.shares_count,
                    'created_at', p.created_at,
                    'is_liked', EXISTS(
                        SELECT 1
                        FROM likes l2
                        WHERE l2.target_id = p.id
                            AND l2.target_type = 'post'
                            AND l2.user_id = $1
                    ),
					'is_saved',EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $1
							AND b.post_id=p.id
					), 'comments_count',
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    )
                ) AS post_data, 
                json_build_object(
                    'id', u.id,
                    'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                    'username', u.lio_userid,
                    'image', u.image
                ) AS user_data
                FROM posts AS p
                JOIN comments AS c
                ON c.post_id =p.id AND c.user_id = $4
                JOIN users AS u
                ON u.id = p.user_id AND u.acc_type = 'public'
                WHERE  ($2 :: BIGINT IS NULL OR p.id < $2)
                GROUP BY p.id,u.id
                ORDER BY p.id DESC
                limit $3;`
                    , [visiterId, lastFeedId, limit, userId]
                );


                return returnRes(res, 200, { message: 'Success', posts: result.rows });
            }

            }


            const isPrivate = userDetail.acc_type == 'private';
            const followingResult = await db.query(
                `SELECT (
                    EXISTS(
                    SELECT 1
                    FROM followers
                    WHERE follower_id=$1
                        AND following_id=$2
                        AND status ='accepted'
                    )
                )`,
                [visiterId, userId]
            );

            const isFollowing = followingResult.rows[0]?.exists;
            if (isPrivate && !isFollowing) {
                return returnRes(res, 200, {
                    user: {
                        id: userDetail.id,
                        username: userDetail.username,
                        acc_status: userDetail.acc_status,
                        acc_type: userDetail.acc_type
                    },
                    restrictions: {
                        show_posts: false,
                        reason: "PRIVATE_ACCOUNT",
                        message: "Follow this account to see their posts"
                    }
                });
            }
            if (reqType == 'posts') {
                const result = await db.query(
                    `SELECT 
                p.* ,
                count(l.id) AS likes_count,
                EXISTS(
                    SELECT 1
                    FROM likes AS l2
                    WHERE l2.target_type = 'post'
                    AND l2.target_id = p.id
                    AND l2.user_id = $4
                ) AS is_liked,
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    ) AS comments_count,
				EXISTS(
					SELECT 1
					FROM bookmarks AS b
					WHERE b.user_id = $4
						AND b.post_id=p.id
				) AS is_saved
                FROM posts AS p
                LEFT JOIN likes AS l
                ON p.id=l.target_id AND l.target_type='post'
                WHERE p.user_id = $1
                    AND ($2 :: BIGINT IS NULL OR p.id < $2)
                GROUP BY p.id
                ORDER BY id DESC
                LIMIT $3`
                    , [userId, lastFeedId, limit, visiterId]
                );
                return returnRes(res, 200, { mustFollow: false, posts: result.rows });
            }
            else if (reqType == 'saved_posts') {
                const result = await db.query(
                    `SELECT 
                    json_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'content', p.content,
                    'mood_tag', p.mood_tag,
                    'media_url', p.media_url,
                    'post_type', p.post_type,
                    'likes_count',(
                    SELECT COUNT(l1.id)
                    FROM likes AS l1
                    WHERE l1.target_id=p.id
                        AND l1.target_type='post'
                    ),
                    'share_count', p.shares_count,
                    'created_at', p.created_at,
                    'is_liked', EXISTS(
                        SELECT 1
                        FROM likes l2
                        WHERE l2.target_id = p.id
                            AND l2.target_type = 'post'
                            AND l2.user_id = $1
                    ),
					'is_saved',EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $1
							AND b.post_id=p.id
					), 'comments_count',
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    )
                ) AS post_data, 
                json_build_object(
                    'id', u.id,
                    'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                    'username', u.lio_userid,
                    'image', u.image
                ) AS user_data
                FROM posts AS p
                JOIN bookmarks AS b
                ON b.post_id =p.id AND b.user_id = $4
                JOIN users AS u
                ON u.id = p.user_id AND u.acc_type = 'public'
                
                WHERE  ($2 :: BIGINT IS NULL OR p.id < $2)
                GROUP BY p.id,u.id
                ORDER BY p.id DESC
                limit $3;`
                    , [visiterId, lastFeedId, limit, userId]
                );


                return returnRes(res, 200, { message: 'Success', posts: result.rows });
            }
            else if (reqType == 'replied_post') {
                const result = await db.query(
                    `SELECT 
                    json_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'content', p.content,
                    'mood_tag', p.mood_tag,
                    'media_url', p.media_url,
                    'post_type', p.post_type,
                    'likes_count',(
                    SELECT COUNT(l1.id)
                    FROM likes AS l1
                    WHERE l1.target_id=p.id
                        AND l1.target_type='post'
                    ),
                    'share_count', p.shares_count,
                    'created_at', p.created_at,
                    'is_liked', EXISTS(
                        SELECT 1
                        FROM likes l2
                        WHERE l2.target_id = p.id
                            AND l2.target_type = 'post'
                            AND l2.user_id = $1
                    ),
					'is_saved',EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $1
							AND b.post_id=p.id
					), 'comments_count',
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    )
                ) AS post_data, 
                json_build_object(
                    'id', u.id,
                    'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                    'username', u.lio_userid,
                    'image', u.image
                ) AS user_data
                FROM posts AS p
                JOIN comments AS c
                ON c.post_id =p.id AND c.user_id = $4
                JOIN users AS u
                ON u.id = p.user_id AND u.acc_type = 'public'
                WHERE ($2 :: BIGINT IS NULL OR p.id < $2)
                GROUP BY p.id,u.id
                ORDER BY p.id DESC
                limit $3;`
                    , [visiterId, lastFeedId, limit, userId]
                );


                return returnRes(res, 200, { message: 'Success', posts: result.rows });
            }

        } catch (err) {
            console.error(err);
            return returnRes(res, 500, { error: "Internal Server Error!" });
        }

    }

    // Controller function to delete user itself post.
    deleteMyPost = async (req, res) => {

        const userId = req.id;
        const { postId } = req.body;
        try {
            const post = await db.query(
                `SELECT 
                user_id
                FROM posts
                WHERE id =$1`,
                [postId]
            );

            if (post.rows.length != 0 && post.rows[0].user_id == userId) {

                await db.query(
                    `DELETE
                    FROM posts
                    WHERE id = $1`,
                    [postId]
                );
                return returnRes(res, 200, { message: 'Post Deleted.' });
            }
            return returnRes(res, 400, { error: 'Something went wrong!' });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function to get post for feed.
    getPosts = async (req, res) => {
        let { currPage, reqMood = [], limit, reqFollowing = false, lastFeedId } = req.query;
        if (!reqMood) {
            reqMood = [];
        } else if (Array.isArray(reqMood)) {
            reqMood = reqMood.flatMap(v => v.split(','));
        } else {
            reqMood = reqMood.split(',');
        }

        reqMood = reqMood.map(m => m.trim().toLowerCase());

        const userId = req.id;
        try {

            const blocklist_result = await db.query(
                `SELECT DISTINCT
                    CASE
                    WHEN blocker_id = $1 THEN blocked_id
                    ELSE blocker_id
                    END AS user_id
                FROM blocked_accounts
                WHERE blocker_id = $1 OR blocked_id = $1;`,
                [userId]
            );

            const blocked_id = blocklist_result.rows.map(r=>r.user_id);

            if (reqFollowing) {
                const followingResult = await db.query(
                    `SELECT 
                    f.*
                    FROM followers AS f
                    JOIN users AS u
                    ON u.id = f.following_id

                    WHERE f.follower_id= $1 
                        AND f.status = 'accepted' 
                        AND u.acc_status = 'active'
                        AND NOT (u.id = ANY($2))`,
                    [userId,blocked_id]
                );
                if (followingResult.rows.length == 0) {
                    return returnRes(res, 200, { message: 'Follow someone to get following feed.', postsList: [] });
                }
                const followingList = followingResult.rows.map(f => f.following_id);

                const result = await db.query(
                    `SELECT 
                    json_build_object(
                        'id', p.id,
                        'user_id', p.user_id,
                        'content', p.content,
                        'mood_tag', p.mood_tag,
                        'media_url', p.media_url,
                        'post_type', p.post_type,
                        'likes_count',count(l.id),
                        'share_count', p.shares_count,
                        'created_at', p.created_at,
                        'is_liked', EXISTS(
                            SELECT 1
                            FROM likes l2
                            WHERE l2.target_id = p.id
                                AND l2.target_type = 'post'
                                AND l2.user_id = $4
                        ),
					    'is_saved',EXISTS(
						    SELECT 1
						    FROM bookmarks as b
						    WHERE b.user_id = $4
							    AND b.post_id=p.id
					    ),'comments_count',
                        (
                            SELECT COUNT(c.id)
                            FROM comments AS c
                            WHERE c.post_id=p.id
                        )
                    ) AS post_data, 
                    json_build_object(
                        'id', u.id,
                        'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                        'username', u.lio_userid,
                        'image', u.image,
                        'following_status',(
                            SELECT status
                            FROM followers AS f
                            WHERE f.follower_id =$4
                                AND f.following_id = u.id
                        )

                    ) AS user_data
                    FROM posts AS p
                    JOIN users AS u
                    ON u.id = p.user_id
                    LEFT JOIN likes AS l
                    ON l.target_id = p.id AND l.target_type ='post'
                    WHERE p.user_id = ANY($1)
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    GROUP BY p.id,u.id
                    ORDER BY p.id DESC
                    limit  $3
                    ;`,
                    [followingList, lastFeedId, limit, userId]
                );


                return returnRes(res, 200, { message: 'Following feed successfully fetched.', postsList: result.rows });

            }
            if (reqMood.length > 0) {

                const result = await db.query(
                    `SELECT 
                json_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'content', p.content,
                    'mood_tag', p.mood_tag,
                    'media_url', p.media_url,
                    'post_type', p.post_type,
                    'likes_count',count(l.id),
                    'share_count', p.shares_count,
                    'created_at', p.created_at,
                    'is_liked', EXISTS(
                        SELECT 1
                        FROM likes l2
                        WHERE l2.target_id = p.id
                            AND l2.target_type = 'post'
                            AND l2.user_id = $4
                    ),
					'is_saved',EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $4
							AND b.post_id=p.id
					),'comments_count',
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    )
                ) AS post_data, 
                json_build_object(
                    'id', u.id,
                    'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                    'username', u.lio_userid,
                    'image', u.image,
                    'following_status',(
                            SELECT status
                            FROM followers AS f
                            WHERE f.follower_id =$4
                                AND f.following_id = u.id
                        )

                ) AS user_data
                FROM posts AS p
                JOIN users AS u
                ON u.id = p.user_id AND u.acc_type ='public'
                LEFT JOIN likes AS l
                ON l.target_id = p.id AND l.target_type ='post'
                WHERE p.mood_tag =ANY($1::varchar[])
                    AND NOT (u.id=ANY($5))
                    AND ($2 :: BIGINT IS NULL OR p.id < $2)
                GROUP BY p.id,u.id
                ORDER BY p.id DESC
                limit $3;`
                    , [reqMood, lastFeedId, limit, userId,blocked_id]
                );
                return returnRes(res, 200, { message: 'Following feed successfully fetched.', postsList: result.rows });
            }
            else {
                const result = await db.query(
                    `SELECT 
                    json_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'content', p.content,
                    'mood_tag', p.mood_tag,
                    'media_url', p.media_url,
                    'post_type', p.post_type,
                    'likes_count',count(l.id),
                    'share_count', p.shares_count,
                    'created_at', p.created_at,
                    'is_liked', EXISTS(
                        SELECT 1
                        FROM likes l2
                        WHERE l2.target_id = p.id
                            AND l2.target_type = 'post'
                            AND l2.user_id = $3
                    ),
					'is_saved',EXISTS(
						SELECT 1
						FROM bookmarks as b
						WHERE b.user_id = $3
							AND b.post_id=p.id
					),'comments_count',
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    )
                ) AS post_data, 
                json_build_object(
                    'id', u.id,
                    'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                    'username', u.lio_userid,
                    'image', u.image,
                    'following_status',(
                            SELECT status
                            FROM followers AS f
                            WHERE f.follower_id =$3
                                AND f.following_id = u.id
                        )


                ) AS user_data
                FROM posts AS p
                JOIN users AS u
                ON u.id = p.user_id AND u.acc_type ='public'
                LEFT JOIN likes AS l
                ON l.target_id = p.id AND l.target_type ='post'
                WHERE NOT(u.id=ANY($4))
                    AND ($1 :: BIGINT IS NULL OR p.id < $1)
                GROUP BY p.id,u.id
                ORDER BY p.id DESC
                limit $2;`
                    , [lastFeedId, limit, userId,blocked_id]
                );
                return returnRes(res, 200, { message: 'Following feed successfully fetched.', postsList: result.rows });
            }




        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function to save or bookmark post.
    savePost = async (req, res) => {
        const { postId } = req.body;
        const userId = req.id;

        try {
            await db.query(
                `INSERT INTO bookmarks
                (
                	user_id ,
                	post_id
                )
                VALUES (
                	$1,
                	$2
                );`,
                [userId, postId]
            )

            return returnRes(res, 200, { messages: "Post saved." });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


    // Controller function to remove saved post or remove bookmark.
    undoSavePost = async (req, res) => {
        const { postId } = req.body;
        const userId = req.id;

        try {
            await db.query(
                `DELETE 
                FROM bookmarks
                WHERE post_id =$1
                    AND user_id =$2;`,
                [postId, userId]
            );

            return returnRes(res, 200, { messages: "Removed saved post." });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
    // controller function to server users their interected posts.

    getActivityPosts = async (req, res) => {
        const userId = req.id;
        const { req_type, currPage, limit, lastFeedId } = req.query;
        try {
            if (req_type == 'liked-posts') {
                const result = await db.query(
                    `SELECT 
                        json_build_object(
                            'id',p.id,
                            'user_id',p.user_id,
                            'content',p.content,
                            'mood_tag',p.mood_tag,
                            'media_url',p.media_url,
                            'post_type',p.post_type,
                            'likes_count',(SELECT 
                                COUNT(l2.id) 
                                FROM likes AS l2
                                WHERE l2.target_type='post' AND l2.target_id=p.id),
                            'shares_count',p.shares_count,
                            'created_at',p.created_at,
                            'is_liked',TRUE,
                            'is_saved',EXISTS(
                                SELECT 1 
                                FROM bookmarks AS b
                                WHERE b.user_id=$1 AND b.post_id = p.id
                            ),'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            )
                        ) AS post_data,
                        json_build_object(  
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image
                        ) AS user_data
                        
                    FROM posts AS p
                    JOIN likes AS l
                    ON l.target_type='post'
                        AND l.target_id=p.id
                    LEFT JOIN users AS u
                    ON u.id=p.user_id
                    WHERE l.user_id=$1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    ORDER BY l.id DESC
                    LIMIT $3
                    `,
                    [userId,lastFeedId,limit]

                );
                return returnRes(res, 200, { message: 'Success', postsList: result.rows });
            }
            else if (req_type == 'saved-posts') {
                const result = await db.query(
                    `SELECT 
                        json_build_object(
                            'id',p.id,
                            'user_id',p.user_id,
                            'content',p.content,
                            'mood_tag',p.mood_tag,
                            'media_url',p.media_url,
                            'post_type',p.post_type,
                            'likes_count',(SELECT 
                                COUNT(l2.id) 
                                FROM likes AS l2
                                WHERE l2.target_type='post' AND l2.target_id=p.id),
                            'shares_count',p.shares_count,
                            'created_at',p.created_at,
                            'is_liked',EXISTS (
								SELECT 1
								FROM likes AS l
								WHERE l.target_type='post' 
									AND l.target_id = p.id 
									AND l.user_id=$1
							),
                            'is_saved',TRUE,
                            'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            )
                        ) AS post_data,
                        json_build_object(
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image
                        ) AS user_data
                        
                    FROM posts AS p
                    JOIN bookmarks AS b
                    ON b.post_id=p.id
                    LEFT JOIN users AS u
                    ON u.id=p.user_id
                    WHERE b.user_id=$1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    ORDER BY b.id DESC
                    LIMIT=$3`,
                    [userId,lastFeedId,limit]

                );
                return returnRes(res, 200, { message: 'Success', postsList: result.rows });
            }
            else if (req_type == 'interacted-posts') {
                const result = await db.query(
                    `SELECT 
                        json_build_object(
                            'id',p.id,
                            'user_id',p.user_id,
                            'content',p.content,
                            'mood_tag',p.mood_tag,
                            'media_url',p.media_url,
                            'post_type',p.post_type,
                            'likes_count',(SELECT 
                                COUNT(l2.id) 
                                FROM likes AS l2
                                WHERE l2.target_type='post' AND l2.target_id=p.id),
                            'shares_count',p.shares_count,
                            'created_at',p.created_at,
                            'is_liked',EXISTS (
								SELECT 1
								FROM likes AS l
								WHERE l.target_type='post' 
									AND l.target_id = p.id 
									AND l.user_id=$1
							),
                            'is_saved',EXISTS(
                                SELECT 1 
                                FROM bookmarks AS b
                                WHERE b.user_id=$1 AND b.post_id = p.id
                            ),
                            'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            )
                        ) AS post_data,
                        json_build_object(
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image
                        ) AS user_data
                        
                    FROM posts AS p
                    JOIN comments AS c
                    ON c.post_id = p.id
                    JOIN users AS u
                    ON p.user_id = u.id
                    WHERE c.user_id = $1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    GROUP BY p.id, u.id
                    ORDER BY p.id DESC
                    LIMIT=$3`,
                    [userId,lastFeedId,limit]

                );

                return returnRes(res, 200, { message: 'Success', postsList: result.rows });

            }
            else if (req_type == 'not-interested-posts') {
                const result = await db.query(
                    `SELECT 
                        json_build_object(
                            'id',p.id,
                            'user_id',p.user_id,
                            'content',p.content,
                            'mood_tag',p.mood_tag,
                            'media_url',p.media_url,
                            'post_type',p.post_type,
                            'likes_count',(SELECT 
                                COUNT(l2.id) 
                                FROM likes AS l2
                                WHERE l2.target_type='post' AND l2.target_id=p.id),
                            'shares_count',p.shares_count,
                            'created_at',p.created_at,
                            'is_liked',EXISTS (
								SELECT 1
								FROM likes AS l
								WHERE l.target_type='post' 
									AND l.target_id = p.id 
									AND l.user_id=$1
							),
                            'is_saved',EXISTS(
                                SELECT 1 
                                FROM bookmarks AS b
                                WHERE b.user_id=$1 AND b.post_id = p.id
                            ),
                            'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            )
                        ) AS post_data,
                        json_build_object(
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image
                        ) AS user_data
                        
                    FROM posts AS p
                    JOIN not_interested_posts AS ni
                    ON ni.post_id = p.id
                    JOIN users AS u
                    ON p.user_id = u.id
                    WHERE ni.user_id = $1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    GROUP BY p.id, u.id
                    ORDER BY p.id DESC
                    LIMIT=$3`,
                    [userId,lastFeedId,limit]

                );

                return returnRes(res, 200, { message: 'Success', postsList: result.rows });
            }
            else if (req_type == 'reported-posts') {
                const result = await db.query(
                    `SELECT 
                        json_build_object(
                            'id',p.id,
                            'user_id',p.user_id,
                            'content',p.content,
                            'mood_tag',p.mood_tag,
                            'media_url',p.media_url,
                            'post_type',p.post_type,
                            'likes_count',(SELECT 
                                COUNT(l2.id) 
                                FROM likes AS l2
                                WHERE l2.target_type='post' AND l2.target_id=p.id),
                            'shares_count',p.shares_count,
                            'created_at',p.created_at,
                            'is_liked',EXISTS (
								SELECT 1
								FROM likes AS l
								WHERE l.target_type='post' 
									AND l.target_id = p.id 
									AND l.user_id=$1
							),
                            'is_saved',EXISTS(
                                SELECT 1 
                                FROM bookmarks AS b
                                WHERE b.user_id=$1 AND b.post_id = p.id
                            ),
                            'comments_count',
                            (
                                SELECT COUNT(c.id)
                                FROM comments AS c
                                WHERE c.post_id=p.id
                            )
                        ) AS post_data,
                        json_build_object(
                            'id', u.id,
                            'name', COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                            'username', u.lio_userid,
                            'image', u.image
                        ) AS user_data
                        
                    FROM posts AS p
                    JOIN reports AS r
                    ON r.target_id=p.id
                        AND r.target_type = 'post'
                    JOIN users AS u
                    ON p.user_id = u.id
                    WHERE r.reporter_id = $1
                        AND ($2 :: BIGINT IS NULL OR p.id < $2)
                    GROUP BY p.id, u.id
                    ORDER BY p.id DESC
                    LIMIT=$3`,
                    [userId,lastFeedId,limit]

                );

                return returnRes(res, 200, { message: 'Success', postsList: result.rows });
            }
            else {
                return returnRes(res, 400, { error: 'Feature not availible' });
            }
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // contoller function to get info of post on fullScreen post.
    getPostInfo = async (req, res) => {
        const visitorId = req.id;
        const { post_id } = req.query;
        try {
            const postData = await db.query(
                `SELECT
                    p.id AS id,
                    p.user_id AS user_id,
                    p.content AS content,
                    p.mood_tag AS mood_tag,
                    p.media_url AS media_url,
                    p.post_type AS post_type,
                    (
                        SELECT 
                            COUNT(l2.id) 
                        FROM likes AS l2
                        WHERE l2.target_type='post' AND l2.target_id=p.id
                    ) AS likes_count,
                    (
                        SELECT COUNT(c.id)
                        FROM comments AS c
                        WHERE c.post_id=p.id
                    ) AS comments_count,
                    p.shares_count AS shares_count,
                    p.created_at AS created_at,
                    EXISTS (
						SELECT 1
						FROM likes AS l
						WHERE l.target_type='post' 
							AND l.target_id = p.id 
							AND l.user_id=$2
					) AS is_liked,
                    EXISTS (
                        SELECT 1 
                            FROM bookmarks AS b
                            WHERE b.user_id=$2 AND b.post_id = p.id
                    ) AS is_saved   
                FROM posts AS p 
                WHERE p.id = $1`,
                [post_id, visitorId]
            );

            if (postData.rows.length == 0) {
                return returnRes(res, 200, {
                    restrictions: {
                        is_restricted: true,
                        reason: 'POST_NOT_EXISTS',
                        message: 'This post does not exists.',
                        title: 'Post not exists',
                        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1768114434/nbbj6vdpb8rahvsejoiz.png'
                    }
                });
            }
            const userId = postData.rows[0]?.user_id;
            const userData = await db.query(
                `SELECT
                    u.id AS id,
                    u.lio_userid AS username,
                    COALESCE(NULLIF(u.fake_name,''),u.first_name) AS name,
                    u.image AS image,
                    u.acc_type AS acc_type,
                    u.acc_status AS acc_status,
                    (
                        SELECT f.status
                        FROM followers AS f
                        WHERE follower_id = $2 
                            AND following_id = u.id
                    ) AS following_status 
                FROM users AS u
                WHERE u.id=$1
                `,
                [userId, visitorId]
            );
            if (userData?.rows.length == 0) {
                return returnRes(res, 200, {
                    restrictions: {
                        is_restricted: true,
                        reason: 'POST_NOT_EXISTS',
                        message: 'This post does not exists.',
                        title: 'Post not exists',
                        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1768114434/nbbj6vdpb8rahvsejoiz.png'
                    }
                });
            }
            const accStatus = userData.rows[0]?.acc_status
            if (accStatus != 'active') {
                return returnRes(res, 200, {
                    restrictions: {
                        is_restricted: true,
                        reason: (accStatus == 'deactive') ? "DEACTIVATED_ACCOUNT" : "SUSPENDED_ACCOUNT",
                        message: "Sorry! ,We can't show posts from this account.",
                        title: (accStatus == 'deactive') ? "This account has been Temporarily Deactivated" : "This account has been Suspended",
                        image: (accStatus == 'deactive') ? 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767884508/nd3lir2au0iijzpxv4wk.png' : 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767883872/ugawmofhb7scnu4mozws.png'
                    }
                })
            }
            const accType = userData.rows[0]?.acc_type;
            const followingStatus = userData.rows[0]?.following_status;
            if (accType == 'private' && followingStatus != 'accepted' && visitorId != userId) {
                return returnRes(res, 200, {
                    restrictions: {
                        is_restricted: true,
                        reason: "PRIVATE_ACCOUNT",
                        message: "Follow this account to see their posts",
                        title: 'This account is Private',
                        image: 'https://res.cloudinary.com/dns5lxuvy/image/upload/v1767880329/ffaril9idaw7ln5xqsyg.png'
                    }
                })
            }

            return returnRes(res, 200, { postData: postData.rows[0], userData: userData.rows[0] });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}

export default new Post();

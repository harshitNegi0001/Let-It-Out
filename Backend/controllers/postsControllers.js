
import { returnRes } from "../utils/returnRes.js";
import db from "../utils/db.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

class Post {
    // Controller function for creating post
    createPost = async (req, res) => {
        const userId = req.id;

        try {
            const { content = "", post_type, mood = "unsure" } = req.body;
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
            console.error(err);
            return returnRes(res, 500, { error: "Internal Server Error!" });
        }
    };

    // controller function to get posts of a specific profile
    getProfilePost = async (req, res) => {

        const visiterId = req.id;
        const { userId, limit, currPage } = req.query;

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
                const result = await db.query(
                    `SELECT 
                    * FROM posts
                    WHERE user_id = $1
                    ORDER BY id DESC
                    OFFSET $2
                    LIMIT $3`
                    , [userId, (limit * (currPage - 1)), limit]
                );


                return returnRes(res, 200, { message: 'Success', posts: result.rows });
            }


            const isPrivate = userDetail.acc_type == 'private';
            const isFollowing = false;
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

            const result = await db.query(
                `SELECT 
                * 
                FROM posts
                WHERE user_id = $1
                ORDER BY id DESC
                OFFSET $2
                LIMIT $3`
                , [userId, (limit * (currPage - 1)), limit]
            );

            return returnRes(res, 200, { mustFollow: false, posts: result.rows });

        } catch (err) {
            // console.error(err);
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
            // frontend sent ?reqMood=a&reqMood=b
            reqMood = reqMood.flatMap(v => v.split(','));
        } else {
            // frontend sent ?reqMood=a,b
            reqMood = reqMood.split(',');
        }

        reqMood = reqMood.map(m => m.trim().toLowerCase());

        const userId = req.id;
        try {

            if (reqFollowing) {
                const followingResult = await db.query(
                    `SELECT 
                    f.*
                    FROM followers AS f
                    JOIN users AS u
                    ON u.id = f.following_id

                    WHERE f.follower_id= $1 AND f.status = 'accepted' AND u.acc_status = 'active'`,
                    [userId]
                );
                if (followingResult.rows.length == 0) {
                    return returnRes(res, 200, { message: 'Follow someone to get following feed.', postsList: [] });
                }
                const followingList = followingResult.rows.map(f => f.following_id);

                const result = await db.query(
                    `SELECT 
                    * 
                    FROM posts
                    WHERE user_id = ANY($1)
                    ORDER BY id DESC
                    offset $2
                    limit  $3
                    ;`,
                    [followingList, (limit * (currPage - 1)), limit]
                );


                return returnRes(res, 200, { message: 'Following feed successfully fetched.', postsList: result.rows });

            }
            const result = await db.query(
                `SELECT 
                * 
                FROM posts
                WHERE mood_tag =ANY($1::varchar[])
                ORDER BY id DESC
                offset $2
                limit $3;`
                , [reqMood, (limit * (currPage - 1)), limit]
            );
            
            return returnRes(res, 200, { message: 'Following feed successfully fetched.', postsList: result.rows });
        } catch (err) {
            console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}

export default new Post();

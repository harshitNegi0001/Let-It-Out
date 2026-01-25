import { returnRes } from "../utils/returnRes.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from 'streamifier';
import db from '../utils/db.js';
import bcrypt from 'bcrypt';
import Auth from './authController.js';
class UserProfile {

    uploadImage = async (req, res) => {

        try {
            if (!req.file) {
                return returnRes(res, 400, { error: 'No image provided' });
            }

            const { type } = req.body;

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: type === 'cover' ? 'covers' : 'profiles',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }

                    return res.status(200).json({
                        imageUrl: result.secure_url,
                        bytes: result.bytes,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                    });
                }
            );

            // stream buffer to Cloudinary
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

        } catch (err) {

            res.status(500).json({ error: "Internal Server Error!" });
        }
    };
    updateProfile = async (req, res) => {
        const userId = req.id;

        try {
            const { coverImage, profileImage, userBasicDetail } = req.body;

            const dob = userBasicDetail?.dob || null;

            await db.query(`UPDATE users SET fake_name=$1, dob=$2, bio=$3, image=$4, bg_image=$5 WHERE id=$6`, [userBasicDetail?.fake_name, dob, userBasicDetail?.bio, profileImage, coverImage, userId]);

            const userInfo = await Auth.getUserDetail(userId);

            return returnRes(res, 200, { message: "SuccessFull", userInfo });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: "Internal server error!" });
        }
    }


    setupNewUser = async (req, res) => {
        const userId = req.id;

        try {
            const { username, password, fakeName, profileImg } = req.body;
            const hashedPass = await bcrypt.hash(password, 10);
            await db.query("UPDATE users SET lio_userid = $1, password=$2,fake_name=$3,image=$4 WHERE id =$5", [username, hashedPass, fakeName, profileImg, userId]);
            const result = await db.query(`SELECT id, email,first_name, name, google_uid, fake_name, lio_userid, image, bio, bg_image, dob, acc_status, created_at FROM users WHERE id = $1`, [userId]);
            const userInfo = result.rows[0];

            return returnRes(res, 200, { message: "Success!", userInfo });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: "Internal Server Error!" });
        }
    }

    // Controller function for changing account privacy

    changePrivacy = async (req, res) => {
        const userId = req.id;


        try {
            const { accountType } = req.body;

            if (accountType != 'public' && accountType != 'private') {
                return returnRes(res, 400, { error: 'Account can only be public or private.' });

            }

            await db.query(`
            UPDATE users
            SET acc_type = $1
            WHERE id = $2
            `, [accountType, userId]);

            return returnRes(res, 200, { message: 'Success', accountType: accountType });
        } catch (err) {
            // console.log(err);

            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    // controller function to check availibility of username.
    checkUsername = async (req, res) => {
        // const userId = req.id;

        try {
            const { username } = req.body;

            if (!username || typeof username !== "string") {
                return returnRes(res, 400, { error: "Invalid username" });
            }

            const usernameRegex = /^[a-z][a-z0-9_]{2,19}$/;
            if (!usernameRegex.test(username)) {
                return returnRes(res, 400, { error: "Invalid username format" });
            }
            const result = await db.query(
                `SELECT 1
                FROM users
                WHERE LOWER(lio_userid)  =LOWER($1)`
                , [username]
            );

            const isAvailable = result.rows.length == 0;
            return returnRes(res, 200, { isAvailable, message: `is available : ${isAvailable}` });
        }
        catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    // Controller function that return 10 new users list.

    getNewUsers = async (req, res) => {
        const userId = req.id;
        try {
            const userFollowing = [userId];
            // append following users.
            const result = await db.query(
                `SELECT 
                id,
                lio_userid as username,
                image,
                fake_name,
                first_name
                FROM users
                WHERE 
                NOT (id = ANY($1)) AND acc_status = 'active'
                ORDER BY id DESC
                LIMIT $2`,
                [userFollowing, 10]
            );
            const usersList = result.rows.map(u => {
                return {
                    id: u.id,
                    username: u.username,
                    image: u.image,
                    name: u.fake_name || u.first_name,
                }
            });

            return returnRes(res, 200, { usersList });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    // Controller function to get data to visit other's profile.

    getProfileData = async (req, res) => {
        try {
            const visitorId = req.id;
            // store visiter
            const { username } = req.query;

            const result = await db.query(
                `SELECT
                id,
                lio_userid as username,
                fake_name,
                first_name,
                image,
                bio,
                bg_image,
                acc_type,
                acc_status
                FROM users
                WHERE lio_userid = $1`
                , [username]
            );


            // if deactive than don't sent image , name, bg image,bio,
            if (result.rows.length > 0) {
                const user = result.rows[0]
                if (user.acc_status == 'active') {
                    const isFollower = await db.query(
                        `SELECT status FROM followers
                        WHERE follower_id = $1 AND following_id =$2`,
                        [visitorId, user.id]
                    );
                    const countFollowers = await db.query(
                        `SELECT
                        COUNT(id)
                        FROM followers
                        WHERE following_id = $1 AND status ='accepted'`,
                        [user.id]
                    )
                    const countFollowings = await db.query(
                        `SELECT
                        COUNT(id)
                        FROM followers
                        WHERE follower_id = $1 AND status ='accepted'`,
                        [user.id]
                    )

                    const followingStatus = (isFollower.rows.length > 0) ? isFollower.rows[0].status : 'not_followed'
                    const filtered_info = {
                        id: user.id,
                        name: user.fake_name || user.first_name,
                        username: user.username,
                        image: user.image,
                        bio: user.bio,
                        cover_image: user.bg_image,
                        acc_type: user.acc_type,
                        acc_status: user.acc_status,
                        followingStatus,
                        followers: countFollowers.rows[0].count,
                        followings: countFollowings.rows[0].count
                    }
                    if (visitorId != user.id) {
                        await db.query(
                            `
                            INSERT INTO visitors (user_id, visitor_id)
                            VALUES ($1, $2)
                            ON CONFLICT (user_id, visitor_id, visited_date)
                            DO NOTHING;
                            `,[user.id,visitorId]
                        )
                    }
                    return returnRes(res, 200, { message: 'User Info fetched', userDetail: filtered_info });
                }
                else {
                    const filtered_info = {
                        username: user.username,
                        name: user.fake_name || user.first_name,
                        acc_status: user.acc_status,
                        id: user.id
                    }
                    return returnRes(res, 200, {
                        userDetail: filtered_info,
                        restriction: {
                            isRestricted: true,
                            reason: (user.acc_status == 'deactive') ? 'DEACTIVATED_ACCOUNT' : 'SUSPENDED_ACCOUNT',
                            message: (user.acc_status == 'deactive') ? 'This user has been deactivated this account' : 'This user has been suspended.'
                        }
                    })
                }
            }
            else {
                return returnRes(res, 404, { error: 'User not found.' });
            }


        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
    // Controller function to search a user by it's username or name

    searchUsers = async (req, res) => {
        const { query } = req.query;
        const userId = req.id;

        try {

            const exactResult = await db.query(
                `SELECT 
                id,
                COALESCE(NULLIF(fake_name, ''), first_name) as name,
                lio_userid as username,
                image

                FROM users
                WHERE lio_userid =$1
                `,
                [query]
            );
            let searchResult = [];
            searchResult.push(...exactResult.rows);
            let alreadySearchedId = searchResult.map(u => u.id);

            const fakenameSearch = await db.query(
                `SELECT 
                    id,
                    COALESCE(NULLIF(fake_name, ''), first_name) AS name,
                    lio_userid AS username,
                    image
                FROM users
                WHERE (
                    fake_name ILIKE ($1::text || '%')
                    OR lio_userid ILIKE ($1::text || '%')
                )
                AND id != ALL($2::int[])`,
                [query, alreadySearchedId]
            );

            searchResult.push(...fakenameSearch.rows);
            return returnRes(res, 200, { searchResults: searchResult });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }

    // controller function to get profile visitor.
    getProfileVisitor = async(req,res)=>{
        const userId = req.id;
        try {
            const result = await db.query(
                `SELECT 
 					v.visited_date AS visited_date,
                    json_agg(
						json_build_object(
							'id',v.id ,
							'user_info',
                    		json_build_object(
                        		'id',u.id,
                        		'name',COALESCE(NULLIF(u.fake_name, ''), u.first_name),
                        		'image',u.image,
                        		'username',u.lio_userid,
                        		'bio',u.bio,
                        		'following_status',(
                            		SELECT f.status 
                            		FROM followers AS f
                            		WHERE f.follower_id =$1
                                	AND f.following_id = u.id
                        		),
                        		'is_follower',EXISTS(
                            		SELECT 1
                            		FROM followers AS f2
                            		WHERE f2.follower_id =u.id
                                		AND f2.following_id = $1
                                		AND f2.status='accepted'
                           			)
                    		) ,
                    		'visited_data',v.visited_date ,
                    		'created_at',v.created_at
						)
					) AS users_list
                FROM visitors AS v
                JOIN users AS u
                ON u.id = v.visitor_id
                WHERE v.user_id = $1
				GROUP BY v.visited_date
                ORDER BY v.visited_date DESC`,
                [userId]
            );
            return returnRes(res,200,{message:'visitors list fetched',usersList:result.rows});

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}

export default new UserProfile();
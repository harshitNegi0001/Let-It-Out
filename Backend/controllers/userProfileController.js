import { returnRes } from "../utils/returnRes.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from 'streamifier';
import db from '../utils/db.js';
import bcrypt from 'bcrypt';

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
            const result = await db.query(`SELECT id, email,first_name, name, google_uid, fake_name, lio_userid, image, bio, bg_image, dob, acc_status, created_at FROM users WHERE id = $1`, [userId]);
            const userInfo = result.rows[0];

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
}

export default new UserProfile();
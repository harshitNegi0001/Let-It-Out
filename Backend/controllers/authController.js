import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '../utils/googleAuth.js';
import { returnRes } from '../utils/returnRes.js';
import axios from 'axios';
import db from '../utils/db.js';
import createToken from '../utils/createToken.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// import { sendEmail } from '../config/nodemailer.js';
import { sendEmail } from '../config/send_email.js';
import { createOtpMessage } from '../utils/optMsg.js';

dotenv.config();


class Auth {
  frontend_url = process.env.FRONTEND_URL
  // control function for user login with credentials
  userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await db.query(`
        SELECT 
        password,id 
        FROM users 
        WHERE email=$1`
        , [email]
      );
      if (result.rows.length > 0) {
        const storedPass = result.rows[0].password;
        const isValid = await bcrypt.compare(password, storedPass);

        if (isValid) {
          const userId = result.rows[0].id;
          const userInfo = await this.getUserDetail(userId);
          const token = createToken({ id: userId });
          res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true
          });
          return returnRes(res, 200, { message: 'Login Success', userInfo });
        }


        return returnRes(res, 401, { error: 'Wrong Email or Password' });
      }
      else {

        return returnRes(res, 401, { error: 'Wrong Email or Password' });
      }
    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  // controller function for login through OAuth
  googleLogin = async (req, res) => {
    // console.log('hereGoogleLogin');
    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

      res.cookie('state', state, {
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
        sameSite: 'none',
        secure: true
      });
      res.cookie('codeVerifier', codeVerifier, {
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
        sameSite: 'none',
        secure: true
      });

      return res.redirect(url.toString());
    }
    catch (err) {
      // console.log(err);
      return res.end('error');
    }
  }

  //fallback function after user login through OAuth
  googleFallback = async (req, res) => {

    try {
      const { code, state } = req.query;
      const storedState = req.cookies.state;
      const storedVerifier = req.cookies.codeVerifier;

      if (state != storedState) {
        return returnRes(res, 400, { error: 'Something went wrong' });

      }

      const token = await google.validateAuthorizationCode(code, storedVerifier);

      const userInfo = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.data.access_token}` } })
      const user = userInfo.data;


      const result = await db.query(`
        SELECT 
        id 
        FROM users 
        WHERE email = $1`
        , [user.email]
      );
      if (result.rows.length > 0) {
        const token = createToken({ id: result.rows[0].id });
        res.cookie('authToken', token, {
          httpOnly: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7,
          secure: true
        });
        return res.redirect(`${this.frontend_url}`);
      }
      else {
        const newUser = await db.query(`
          INSERT INTO 
          users (google_uid,name,email,first_name) 
          VALUES($1,$2,$3,$4) 
          RETURNING id`
          , [user.sub, user.name, user.email, user.given_name]
        );
        const token = createToken({ id: newUser.rows[0].id });
        res.cookie('authToken', token, {
          httpOnly: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7,
          secure: true
        });
        return res.redirect(`${this.frontend_url}/new-user-setup/`);

      }
    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }


  }
  // helper function to get current user's info
  getUserDetail = async (userId) => {
    try {

      const result = await db.query(`
        SELECT 
        id, 
        email, first_name, 
        fake_name, lio_userid as username, 
        image, bio, 
        bg_image, acc_status,
        acc_type, dob, 
        created_at 
        FROM users 
        WHERE id = $1`, [userId]
      );

      const countFollowers = await db.query(
        `SELECT
        COUNT(id)
        FROM followers
        WHERE following_id = $1 AND status ='accepted'`,
        [userId]
      );
      const countFollowings = await db.query(
        `SELECT
        COUNT(id)
        FROM followers
        WHERE follower_id = $1 AND status ='accepted'`,
        [userId]
      );
      const user = result.rows[0];
      const user_info = {
        id: user.id,
        name: user.fake_name || user.first_name,
        username: user.username,
        image: user.image,
        bio: user.bio,
        cover_image: user.bg_image,
        acc_type: user.acc_type,
        acc_status: user.acc_status,
        dob: user.dob,
        email: user.email,
        created_at: user.created_at,
        followers: countFollowers.rows[0].count,
        followings: countFollowings.rows[0].count
      }

      return user_info;
    }
    catch (err) {
      throw err;
    }
  }

  // controller function for getting user info
  getMe = async (req, res) => {
    const userId = req.id;

    try {
      const userInfo = await this.getUserDetail(userId);
      if (!userInfo) {
        return returnRes(res, 404, { error: 'User not found!' });

      }

      return returnRes(res, 200, { message: 'Request Success', userInfo });


    }
    catch (err) {

      // console.log(err);
      return returnRes(res, 500, { error: 'Internal Server Error!' });
    }
  }

  // controller function for log out

  logout = async (req, res) => {
    try {

      res.cookie('authToken', null, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
      });
      return returnRes(res, 200, { message: 'Successfully logged out!' });


    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal Server Error!' });

    }
  }


  // Controller function for changing password.

  changePass = async (req, res) => {

    try {
      const userId = req.id;
      const { newPass, oldPass } = req.body;

      const result = await db.query(`
        SELECT 
        password 
        FROM users 
        WHERE id = $1`
        , [userId]
      );
      const hashedPass = result.rows[0].password;

      const isMatched = await bcrypt.compare(oldPass, hashedPass);

      if (isMatched) {
        const newHashedPass = await bcrypt.hash(newPass, 10);
        await db.query(`
          UPDATE users
          SET password = $1
          WHERE id = $2;
          `, [newHashedPass, userId]
        );

        return returnRes(res, 200, { message: 'Password Changed!' });

      }
      else {
        return returnRes(res, 401, { error: 'Invalid credentials!' });
      }


    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal Server Error!' });
    }
  }


  // controller function to temprary deactivate account.
  deactivateAccount = async (req, res) => {

    const userId = req.id;
    try {
      const { password } = req.body;
      const result = await db.query(
        `SELECT 
        password
        FROM users
        WHERE id = $1`
        , [userId]
      );

      const hashedPass = result.rows[0].password;
      const isMatched = await bcrypt.compare(password, hashedPass);

      if (isMatched) {
        await db.query(
          `UPDATE users
          SET acc_status = 'deactive'
          WHERE id = $1`
          , [userId]
        );
        const userInfo = await this.getUserDetail(userId);
        // res.cookie('authToken', null, {
        //   httpOnly: true,
        //   secure: false,
        //   sameSite: 'lax',
        //   maxAge: 0
        // });
        return returnRes(res, 200, { message: 'Account deactivated!', userInfo });
      }
      return returnRes(res, 401, { error: 'Invalid credentials!' });

    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  reactivateAccount = async (req, res) => {

    const userId = req.id;

    try {
      await db.query(
        `UPDATE users
        SET acc_status = 'active'
        WHERE id = $1`
        , [userId]
      );

      const userInfo = await this.getUserDetail(userId);

      return returnRes(res, 200, { message: 'Account Activated.', userInfo });

    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  // controller function for permanent deleting account.

  deleteAccount = async (req, res) => {
    const userId = req.id;
    try {
      const { password } = req.body;
      const result = await db.query(
        `SELECT 
        password
        FROM users
        WHERE id = $1`
        , [userId]
      );

      const hashedPass = result.rows[0].password;
      const isMatched = await bcrypt.compare(password, hashedPass);

      if (isMatched) {
        await db.query(
          `DELETE
          FROM users
          WHERE id = $1`
          , [userId]
        );
        res.cookie('authToken', null, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 0
        });

        return returnRes(res, 200, { message: 'Account deleted!' });
      }
      return returnRes(res, 401, { error: 'Invalid credentials!' });

    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  // Controller function to generate and send otp
  handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      // check email exists.
      const result = await db.query(
        `SELECT 
          1
        FROM users
        WHERE email=$1`,
        [email]
      );

      const isExists = result.rows.length > 0;
      if (isExists) {
        // otp limit check here.

        const otp_limit = await db.query(
          `SELECT 
            sent_count
          FROM otp_table
          WHERE email =$1
            AND created_at :: DATE = CURRENT_DATE`,
          [email]
        );

        if (otp_limit.rows.length > 0) {
          const { sent_count } = otp_limit.rows[0];
          if (sent_count >= 10) {
            return returnRes(res, 400, { error: "You’ve reached today’s OTP request limit. Please try again tomorrow." });
          }
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otp_hash = await bcrypt.hash(String(otp), 10);

        const message = createOtpMessage(otp);

        // await sendEmail(email, 'Reset Password', message);
        await sendEmail(email,otp);

        await db.query(
          `INSERT INTO otp_table
          (
            email,otp_hash,expires_at,sent_count
          )
          VALUES(
            $1,$2, now() + interval '10 minutes',1
          )
          ON CONFLICT(email)
          DO UPDATE
          SET 
            otp_hash = EXCLUDED.otp_hash,
            expires_at = EXCLUDED.expires_at,
            created_at = now(),
            sent_count = 
            CASE 
              WHEN otp_table.created_at :: DATE = CURRENT_DATE
              THEN otp_table.sent_count+1
              ELSE 1
            END`,
          [email, otp_hash]
        );

        return returnRes(res, 200, { message: 'Otp sent to your email.' });
      }


      return returnRes(res, 404, { error: 'No user found with this email.' });


    } catch (err) {
      console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  // controller function to verify otp.

  verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
      // otp validation here.

      const otp_check = await db.query(
        `SELECT *
        FROM otp_table
        WHERE email = $1`,
        [email]
      );

      if (otp_check.rows.length == 0) {
        return returnRes(res, 400, { error: 'OTP expired or something went wrong.' });
      }

      const { otp_hash, expires_at } = otp_check.rows[0];
      if (expires_at.getTime() < Date.now()) {
        return returnRes(res, 400, { error: 'OTP expired' });
      }
      const isMatched = await bcrypt.compare(otp, otp_hash);
      if (isMatched) {
        return returnRes(res, 200, { message: 'OTP verified.' });
      }
      return returnRes(res, 400, { error: 'Wrong OTP.' });
    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }

  // Controller function to reset password with the help of OTP.
  resetPassword = async (req, res) => {
    const { email, newPassword, otp } = req.body;
    try {
      const otp_check = await db.query(
        `SELECT *
        FROM otp_table
        WHERE email = $1`,
        [email]
      );

      if (otp_check.rows.length == 0) {
        return returnRes(res, 400, { error: 'OTP expired or something went wrong.' });
      }

      const { otp_hash, expires_at } = otp_check.rows[0];
      if (expires_at.getTime() < Date.now()) {
        return returnRes(res, 400, { error: 'OTP expired' });
      }
      const isMatched = await bcrypt.compare(otp, otp_hash);
      if (isMatched) {
        const hashed_pass = await bcrypt.hash(newPassword, 10);
        const result = await db.query(
          `UPDATE users
          SET password =$1
          WHERE email =$2
          
          RETURNING 
          id `,
          [hashed_pass, email]
        );
        if (result.rows.length == 0) {
          return returnRes(res, 404, { error: 'User not found.' });
        }
        const userId = result.rows[0].id;
        const userInfo = await this.getUserDetail(userId);
        const token = createToken({ id: userId });
        res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'none',
          secure: true
        });
        return returnRes(res, 200, { message: 'Password updated', userInfo: userInfo });

      }
      return returnRes(res, 400, { error: 'Wrong OTP.' });

    } catch (err) {
      // console.log(err);
      return returnRes(res, 500, { error: 'Internal server error!' });
    }
  }
}


export default new Auth();
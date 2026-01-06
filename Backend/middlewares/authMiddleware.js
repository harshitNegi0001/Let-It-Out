import { returnRes } from "../utils/returnRes.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

function authMiddleware(req, res, next) {

    if (!req.cookies || !req.cookies.authToken) {
        return returnRes(res, 401, { error: 'Authentication required!' })
    } else {
        const token = req.cookies.authToken;
        const token_secret = process.env.SECRET;

        try {
            const decodedToken = jwt.verify(token, token_secret)
            req.id = decodedToken.id;
            next();
        }
        catch (err) {
            // console.log(err);
            return returnRes(res, 401, { error: 'Invalid token found' });
        }

    }

}

export default authMiddleware;
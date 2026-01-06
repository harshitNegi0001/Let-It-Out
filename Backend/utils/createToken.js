import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createToken = (data)=>{
    const tokenSecret = process.env.SECRET;

    const token =  jwt.sign(data,tokenSecret,{expiresIn:'7d'});

    return token;
}

export default createToken;
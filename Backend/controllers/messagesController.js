import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Messages{

    // Controller function to get chatlist related to current user.
    getChatlist = async(req,res)=>{


        try{
            const result = await db.query(
                `SELECT 
                id, 
                lio_userid AS username,
                fake_name,
                name,
                image
                FROM users`
            );

            return returnRes(res,200,{message:'Getting chatlist success', chatlist:result.rows});
        }catch(err){
            return returnRes(res,500,{error:'Internal Server Error!'});
        }
    }

}


export default new Messages();
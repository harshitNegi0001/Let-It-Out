import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Followers{

    requestToFollow = async(req,res)=>{
        const follower_id = req.id;
        const {following_id,reqFor} = req.body;
        try {

            if(follower_id==following_id){
                return returnRes(res,404,{error:"Can't follow your own account."});
            }
            
            const isUserExists =await db.query(
                `SELECT acc_type
                FROM users
                WHERE id = $1`,
                [following_id]
            );
            if(isUserExists.rows.length==0){
                return returnRes(res,404,{error:'User not found.'});
            }
            if(reqFor=='cancle'){
                db.query(
                    `DELETE FROM followers
                    WHERE follower_id =$1 AND following_id =$2`,
                    [follower_id,following_id]
                )
                return returnRes(res,200,{messages:'unfollowed',followingStatus:'not_followed'});

            }
            const isPrivateAcc = isUserExists.rows[0].acc_type=='private'
            
                db.query(
                    `INSERT INTO followers
                    (
                        follower_id,
                        following_id,
                        status
                    )
                        
                    VALUES (
                        $1,$2,$3
                    )`,
                    [follower_id,following_id,isPrivateAcc?'pending':'accepted']
                );

            return returnRes(res,200,{message:isPrivateAcc?'Requested':'Following',followingStatus:isPrivateAcc?'pending':'accepted'});
            

            
        } catch (err) {
            return returnRes(res,500,{error:'Internal Server Error!'});
        }
    }
}



export default new Followers();
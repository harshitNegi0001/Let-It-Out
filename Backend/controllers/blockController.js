import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Block {
    // Controller function to get blocked account's list.
    getBlockedAcc = async (req, res) => {
        const blocker_id = req.id;
        try {
            const result = await db.query(
                `SELECT 
                b.id AS id,
                u.id AS user_id,
                u.lio_userid AS username,
                u.image AS image,
                COALESCE(NULLIF(u.fake_name, ''), u.first_name) AS name
                FROM blocked_accounts AS b
                JOIN users AS u
                ON u.id = b.blocked_id
                WHERE b.blocker_id = $1
                ORDER BY b.id DESC`,
                [blocker_id]
            )

            return returnRes(res, 200, { meessage: 'Blocked accoutns list fetched.', usersList: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
    // Controller function to block or Unblock user.
    blockUnblockUser = async (req, res) => {
        const blocker_id = req.id;
        const { blocked_id, operation } = req.body;
        try {
            if (blocked_id == blocker_id) {
                return returnRes(res, 400, { error: `Couldn't block yourself.` });
            }
            if (operation == 'block') {
                await db.query(
                    `INSERT INTO 
                    blocked_accounts
                    (
                        blocker_id,
                        blocked_id
                    )
                    VALUES (
                        $1,
                        $2
                    )
                        ON CONFLICT (blocker_id, blocked_id) DO NOTHING
                    `,
                    [blocker_id,blocked_id]
                );
                return returnRes(res,200,{message:`User blocked.`});
            }

            if (operation == 'unblock') {
                await db.query(
                    `DELETE FROM
                    blocked_accounts
                    WHERE blocker_id = $1
                        AND blocked_id = $2`,
                    [blocker_id,blocked_id]
                );
                return returnRes(res,200,{message:`User unblocked.`});
            }
            return returnRes(res, 404, { error: 'Only block & unblock operation allowed!' });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });

        }
    }
}

export default new Block();
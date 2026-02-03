import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';

class Report {

    addReport = async (req, res) => {
        const reporter_id = req.id;
        const { reported_user_id, reason, target_type, target_id } = req.body;
        try {
            await db.query(
                `INSERT INTO reports
                (
                    reporter_id,
                    reported_user_id,
                    target_type,
                    target_id,
                    reason
                )
                VALUES(
                    $1,$2,$3,$4,$5
                )
                ON CONFLICT (reporter_id, target_type, target_id) DO NOTHING`,
                [reporter_id, reported_user_id, target_type, target_id, reason]
            );

            return returnRes(res, 200, { message: 'Report Submitted.' });

        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}

export default new Report();
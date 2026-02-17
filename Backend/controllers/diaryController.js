import { returnRes } from "../utils/returnRes.js";
import db from "../utils/db.js";
class Diary {

    getDiaryNotes = async (req, res) => {
        const userId = req.user.id;
        const { limit, lastNoteId } = req.query;

        try {
            const result = await db.query(
                `SELECT
                    *
                FROM diary_notes
                WHERE user_id = $1
                    AND ($2 :: BIGINT IS NULL OR id < $2 )
                ORDER BY id DESC
                LIMIT $3`,
                [userId, lastNoteId, limit || 10]
            );

            return returnRes(res, 200, 'Diary notes retrieved successfully!', { notesList: result.rows });
        } catch (err) {
            return returnRes(res, 500, 'Internal Server Error!');
        }
    }

}

export default new Diary();
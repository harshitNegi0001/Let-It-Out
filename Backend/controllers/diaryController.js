import { returnRes } from "../utils/returnRes.js";
import db from "../utils/db.js";
class Diary {

    getDiaryNotes = async (req, res) => {
        const userId = req.id;
        const { limit, last_note_id } = req.query;

        try {
            const result = await db.query(
                `SELECT
                    *
                FROM diary_notes
                WHERE user_id = $1
                    AND ($2 :: BIGINT IS NULL OR id < $2 )
                ORDER BY id DESC
                LIMIT $3`,
                [userId, last_note_id, limit || 10]
            );

            return returnRes(res, 200, { message: 'Diary notes retrieved successfully!', notesList: result.rows });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }


    createNote = async (req, res) => {
        const userId = req.id;
        const { title, content, emoji_key, date } = req.body;
        if (!title || !content || !emoji_key || !date) {
            return returnRes(res, 400, { error: 'All fields are required!' });
        }
        
        try {
            await db.query(
                `INSERT INTO diary_notes
                (
                    user_id,
                    title,
                    content,
                    emoji_key,
                    creation_date
                )
                VALUES(
                    $1, $2, $3, $4, $5
                )`,
                [userId, title, content, emoji_key, date]
            )
            return returnRes(res, 200, {
                message: 'Note Created Successfully!'
            })
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}

export default new Diary();
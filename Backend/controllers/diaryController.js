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


    editNote = async (req, res) => {
        const userId = req.id;
        const { id, title, content, emoji_key, date } = req.body;

        try {
            const check_user = await db.query(
                `SELECT 
                    user_id
                FROM diary_notes
                WHERE id = $1`,
                [id]
            );

            if (check_user.rowCount == 0) {
                return returnRes(res, 404, { error: 'Note not found!' });
            }
            const noteOwnerId = check_user.rows[0].user_id;
            if (noteOwnerId != userId) {
                return returnRes(res, 403, { error: 'You are not authorized to edit this note!' });
            }

            await db.query(
                `UPDATE diary_notes
                SET title =$1,
                    content = $2,
                    emoji_key = $3,
                    creation_date = $4
                WHERE id = $5`,
                [title, content, emoji_key, date, id]
            )

            return returnRes(res, 200, { message: 'Note edited successfully!' });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }

    deleteNote = async (req, res) => {
        const userId = req.id;
        const { id } = req.body;
        try {
            const check_user = await db.query(
                `SELECT 
                    user_id
                FROM diary_notes
                WHERE id = $1`,
                [id]
            );
            if (check_user.rowCount == 0) {
                return returnRes(res, 404, { error: 'Note not found!' });
            }
            const noteOwnerId = check_user.rows[0].user_id;
            if (noteOwnerId != userId) {
                return returnRes(res, 403, { error: 'You are not authorized to delete this note!' });
            }
            await db.query(
                `DELETE 
                FROM diary_notes
                WHERE id =$1`,
                [id]
            );
            return returnRes(res, 200, { message: 'Note deleted successfully!' });
        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }

    }
}

export default new Diary();
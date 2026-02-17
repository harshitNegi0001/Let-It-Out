
export const createDiaryNotesTable = async (pool) => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS diary_notes
            (
                id BIGSERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                emoji_key VARCHAR(50) NOT NULL,
                creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )`
        );

    } catch (err) {
        throw err;
    }
}
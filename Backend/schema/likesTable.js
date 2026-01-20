export const createLikesTable = async (pool) => {

    try {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS likes (
                id BIGSERIAL PRIMARY KEY,

                user_id INTEGER NOT NULL,
                target_type VARCHAR(20) NOT NULL,
                target_id INTEGER NOT NULL,
                

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_likes_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                

                CONSTRAINT unique_like
                    UNIQUE (user_id, target_type, target_id),

                CONSTRAINT check_target_type
                    CHECK (target_type IN ('post', 'comment'))
            );`
        )
    } catch (err) {
        throw err;
    }
}
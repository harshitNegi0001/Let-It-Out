

export const createNotInterestedPostTable = async (pool) => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS not_interested_posts
            (
                id BIGSERIAL PRIMARY KEY,
                post_id BIGINT NOT NULL,
                user_id INTEGER NOT NULL,

                created_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_user
                    FOREIGN KEY (user_id) 
                    REFERENCES  users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_post
                    FOREIGN KEY (post_id)
                    REFERENCES posts(id)
                    ON DELETE CASCADE,
                CONSTRAINT unique_not_interested_post
                    UNIQUE(post_id,user_id)
            )`
        )
    } catch (err) {
        throw err;
    }
}
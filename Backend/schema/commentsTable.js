

export const createCommentsTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS comments
            (
                id BIGSERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                post_id BIGINT NOT NULL,
                parent_id  BIGINT DEFAULT NULL,
                content TEXT NOT NULL,
                is_edited BOOLEAN DEFAULT FALSE,
                updated_at TIMESTAMPTZ DEFAULT now(),
                created_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_user
                    FOREIGN KEY (user_id) 
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_post
                    FOREIGN KEY (post_id)
                    REFERENCES posts(id)
                    ON DELETE CASCADE,
                CONSTRAINT parent_ref
                    FOREIGN KEY (parent_id)
                    REFERENCES comments(id)
                    ON DELETE CASCADE
            );`
        )
    } catch (err) {
        throw err;  
    }
}
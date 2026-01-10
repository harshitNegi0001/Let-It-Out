


export const createPostsTable = async (pool) => {


    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS posts(
	            id BIGSERIAL PRIMARY KEY,
	            user_id INT NOT NULL,
	            content TEXT,
	            media_url TEXT[],
	            post_type VARCHAR(20) NOT NULL DEFAULT 'text',
	            likes_count INT NOT NULL DEFAULT 0,
                comments_count INT NOT NULL DEFAULT 0,
                shares_count INT NOT NULL DEFAULT 0,
	            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    

	            CONSTRAINT fk_user FOREIGN KEY (user_id)
	            REFERENCES users (id)
	            ON DELETE CASCADE,
	
	            CONSTRAINT post_type_check
                    CHECK (post_type IN ('text', 'image', 'mixed'))

            );`
        );
        

    } catch (err) {
        throw err;
    }
}

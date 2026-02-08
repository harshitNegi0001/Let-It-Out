


export const createPostsTable = async (pool) => {


    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS posts(
	            id BIGSERIAL PRIMARY KEY,
	            user_id INT NOT NULL,
	            content TEXT,
                mood_tag VARCHAR(30),
	            media_url TEXT[],
                parent_id BIGINT,
	            post_type VARCHAR(20) NOT NULL DEFAULT 'text',
                shares_count INT NOT NULL DEFAULT 0,
	            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    

	            CONSTRAINT fk_user 
                FOREIGN KEY (user_id)
	            REFERENCES users (id)
	            ON DELETE CASCADE,
                
                CONSTRAINT fk_parent 
                FOREIGN KEY (parent_id)
	            REFERENCES posts (id)
	            ON DELETE CASCADE,
	
	            CONSTRAINT post_type_check
                    CHECK (post_type IN ('text', 'image', 'mixed'))

            );`
        );
        

    } catch (err) {
        throw err;
    }
}

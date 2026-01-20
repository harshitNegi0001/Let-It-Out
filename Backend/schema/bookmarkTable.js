
export const createBookmarksTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS
            bookmarks
            (
            	id BIGSERIAL PRIMARY KEY,
            	user_id INTEGER NOT NULL,
            	post_id INTEGER NOT NULL,
            	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
            	CONSTRAINT uid_fk
            		FOREIGN KEY (user_id)
            		REFERENCES users(id)
            		ON DELETE CASCADE,
            	CONSTRAINT pid_fk
            		FOREIGN KEY (post_id)
            		REFERENCES posts(id)
            		ON DELETE CASCADE,
            	CONSTRAINT unique_bookmark
            		UNIQUE (user_id,post_id)
            );`
        )
    } catch (err) {
        throw err;        
    }
}
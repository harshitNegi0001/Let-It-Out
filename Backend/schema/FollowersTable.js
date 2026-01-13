
export const createFollowersTable = async(pool)=>{

    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS followers (
	            id BIGSERIAL PRIMARY KEY,
	            follower_id INT NOT NULL,
	            following_id INT NOT NULL,
	            status VARCHAR(20) NOT NULL DEFAULT 'accepted',
	            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	            CONSTRAINT fk_following
	            	FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
	            CONSTRAINT fk_follower
	            	FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
	            CONSTRAINT no_self_follow
                	CHECK (follower_id <> following_id),
	            CONSTRAINT unique_follow
                	UNIQUE (follower_id, following_id)
            )`
        )
    } catch (err) {
        throw err;
    }
}
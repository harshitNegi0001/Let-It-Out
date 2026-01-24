export const createVisitorTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS 
            visitors (
            	id BIGSERIAL PRIMARY KEY,
            	user_id INTEGER NOT NULL,
            	visitor_id INTEGER NOT NULL,
            	visited_date DATE DEFAULT CURRENT_DATE,
            	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            	CONSTRAINT fk_user
            		FOREIGN KEY (user_id)
            		REFERENCES users(id)
            		ON DELETE CASCADE,
            	CONSTRAINT fk_visitor
            		FOREIGN KEY (visitor_id)
            		REFERENCES users(id)
            		ON DELETE CASCADE,
            	CONSTRAINT CHECK_SELF_VISIT
            		CHECK (user_id <> visitor_id),
            	CONSTRAINT UNIQUE_DAILY_VISIT
            		UNIQUE(user_id,visitor_id,visited_date)
	
            );`
        );
    } catch (err) {
        throw err;
    }
}


export const createChatWithSIATable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS chat_with_sia (
                id BIGSERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                wrote_by VARCHAR(10) NOT NULL,

                created_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_user_id 
                    FOREIGN KEY (user_id) 
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                
                CONSTRAINT check_wrote_by
                    CHECK (wrote_by IN ('user', 'sia'))
            )`
        )
        
    } catch (err) {
        throw err;
    }
}

export const createNotificationTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS notifications
            (
                id BIGSERIAL PRIMARY KEY,
                receiver_id INTEGER NOT NULL,
                type VARCHAR(20) NOT NULL,
                actor_id INTEGER NOT NULL,
                target_id BIGINT,
                target_type VARCHAR(20),
                count INTEGER DEFAULT 1,
                is_read BOOLEAN DEFAULT FALSE,
                updated_at TIMESTAMPTZ DEFAULT now(),
                created_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_receiver 
                    FOREIGN KEY (receiver_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_actor
                    FOREIGN KEY (actor_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )`
        )
    } catch (err) {
        throw err;
    }
}
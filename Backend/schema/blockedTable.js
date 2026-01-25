
export const createBlockedAccTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS blocked_accounts
            (
                id BIGSERIAL PRIMARY KEY,
                blocker_id INTEGER NOT NULL,
                blocked_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_blocker
                    FOREIGN KEY (blocker_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_blocked
                    FOREIGN KEY (blocked_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT unique_block
                    UNIQUE(blocker_id,blocked_id),
                CONSTRAINT check_self_block
                    CHECK(blocker_id<>blocked_id)
            );
            `
        )
    } catch (err) {
        throw err;        
    }
}

export const createReportTable = async(pool)=>{
    try {
        const result = await pool.query(
            `CREATE TABLE IF NOT EXISTS reports
            (
                id BIGSERIAL PRIMARY KEY,
                reporter_id INTEGER NOT NULL,
                reported_user_id INTEGER NOT NULL,
                reason VARCHAR(50) NOT NULL,
                target_id BIGINT NOT NULL,
                target_type VARCHAR(20) NOT NULL,
                status varchar(20) DEFAULT 'pending',

                created_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_reporter_id
                    FOREIGN KEY (reporter_id)
                    REFERENCES users(id) 
                    ON DELETE CASCADE,
                CONSTRAINT fk_reported_user_id
                    FOREIGN KEY (reported_user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT unique_report
                    UNIQUE(target_id,target_type,reporter_id)
            )`
        )
    } catch (err) {
        throw err;
    }
}
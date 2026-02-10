export const createOtpTable = async(pool)=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS otp_table
            (
                id BIGSERIAL PRIMARY KEY,
                email TEXT NOT NULL,
                otp_hash TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT now(),
                expires_at TIMESTAMPTZ NOT NULL,
                sent_count INT DEFAULT 1,

                CONSTRAINT unique_email_otp
                    UNIQUE(email)
            )`
        )
    } catch (err) {
        throw err;
    }
}
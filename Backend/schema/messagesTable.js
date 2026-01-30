
export const createMessagesTable = async (pool) => {


    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS 
            messages (
                id BIGSERIAL PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                message_type VARCHAR(15) NOT NULL DEFAULT 'text',
                is_delivered BOOLEAN DEFAULT FALSE,
                is_read BOOLEAN DEFAULT FALSE,
                is_edited BOOLEAN DEFAULT FALSE,
                reply_to_msg BIGINT DEFAULT NULL,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now(),

                CONSTRAINT fk_messages_sender
                    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,

                CONSTRAINT fk_messages_receiver
                    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,

                CONSTRAINT fk_messages_reply
                    FOREIGN KEY (reply_to_msg) REFERENCES messages(id) ON DELETE SET NULL
            );`
        );

    } catch (err) {
        throw err;
    }
}

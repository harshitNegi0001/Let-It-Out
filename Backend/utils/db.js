import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const pool = new Pool(
    {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        user: process.env.PG_USER,
        ssl: { rejectUnauthorized: false }

    }
);

pool.connect()
    .then(client => {
        console.log("✅ PostgreSQL connected successfully");
        client.release();
    })
    .catch(err => {
        console.error("❌ PostgreSQL connection error:", err.message);
    });

// Listen for runtime errors (prevents Node crash)
pool.on('error', err => {
    console.error('Unexpected PostgreSQL error:', err);
});



export default pool;
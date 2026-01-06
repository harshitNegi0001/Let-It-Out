import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();




const pool = new Pool(
    {
        host:process.env.PG_HOST,
        port:Number(process.env.PG_PORT),
        database:process.env.PG_DATABASE,
        password:process.env.PG_PASSWORD,
        user:process.env.PG_USER
    }
);



export default pool;
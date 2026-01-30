export const createUsersTable = async (pool) => {


    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS 
        users 
          (id SERIAL PRIMARY KEY,
          google_uid TEXT UNIQUE, 
          name TEXT NOT NULL,
          fake_name TEXT ,
          email TEXT NOT NULL UNIQUE,
          lio_userid TEXT UNIQUE,
          password TEXT,	
          image TEXT ,	
          bio TEXT ,	
          bg_image TEXT,
          first_name TEXT,	
          curr_socket_id TEXT,
          online_status BOOLEAN DEFAULT FALSE ,
          acc_status VARCHAR(20) DEFAULT 'active',
          acc_type VARCHAR(20) DEFAULT 'public' ,
          dob TEXT, 
          created_at TIMESTAMPTZ DEFAULT now(),
          last_login TIMESTAMPTZ );`
        );


    } catch (err) {
        throw err;
    }
}
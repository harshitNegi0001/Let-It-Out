import { returnRes } from "../utils/returnRes.js";
import db from '../utils/db.js';


class Post {
    createPost = async (req, res) => {
        const userId = req.id;

        // const

        try {
            await db.query(`CREATE TABLE IF NOT EXISTS posts(
	            id BIGSERIAL PRIMARY KEY,
	            user_id INT NOT NULL,
	            content TEXT NOT NULL,
	            media_url TEXT[],	
	            visibility VARCHAR(20) NOT NULL DEFAULT 'public',
	            post_type VARCHAR(20) NOT NULL DEFAULT 'text',
	            likes_count INT NOT NULL DEFAULT 0,
                comments_count INT NOT NULL DEFAULT 0,
                shares_count INT NOT NULL DEFAULT 0,
	            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    

	            CONSTRAINT fk_user FOREIGN KEY (user_id)
	            REFERENCES users (id)
	            ON DELETE CASCADE,
	
	            CONSTRAINT post_type_check
                    CHECK (post_type IN ('text', 'image', 'mixed')),

                CONSTRAINT visibility_check
                    CHECK (visibility IN ('public', 'followers', 'private'))
                );`);

            await db.query(`
                INSERT INTO posts (user_id,content,media_url, visibility, post_type)
                VALUES ($1,$2,$3,$4,$5)
                `,[userId,]) 



        } catch (err) {
            // console.log(err);
            return returnRes(res, 500, { error: 'Internal Server Error!' });
        }
    }
}
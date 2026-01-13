import { createUsersTable } from "../schema/createUsers.js";
import { createFollowersTable } from "../schema/FollowersTable.js";
import { createMessagesTable } from "../schema/messagesTable.js";
import { createPostsTable } from "../schema/postsTable.js";
import pool from "./db.js";


export default async function setupTables() {
    await createUsersTable(pool);
    await createMessagesTable(pool);
    await createPostsTable(pool);
    await createFollowersTable(pool);
}
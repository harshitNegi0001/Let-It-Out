import { createBlockedAccTable } from "../schema/blockedTable.js";
import { createBookmarksTable } from "../schema/bookmarkTable.js";
import { createCommentsTable } from "../schema/commentsTable.js";
import { createUsersTable } from "../schema/createUsers.js";
import { createDiaryNotesTable } from "../schema/diaryNotesTable.js";
import { createFollowersTable } from "../schema/FollowersTable.js";
import { createLikesTable } from "../schema/likesTable.js";
import { createMessagesTable } from "../schema/messagesTable.js";
import { createNotificationTable } from "../schema/notificationTable.js";
import { createNotInterestedPostTable } from "../schema/notInterestedTable.js";
import { createOtpTable } from "../schema/otpTable.js";
import { createPostsTable } from "../schema/postsTable.js";
import { createReportTable } from "../schema/reportTable.js";
import { createVisitorTable } from "../schema/visitorTable.js";
import pool from "./db.js";


export default async function setupTables() {
    await createUsersTable(pool);
    await createMessagesTable(pool);
    await createPostsTable(pool);
    await createFollowersTable(pool);
    await createLikesTable(pool);
    await createBookmarksTable(pool);
    await createVisitorTable(pool);
    await createBlockedAccTable(pool);
    await createCommentsTable(pool);
    await createReportTable(pool);
    await createNotInterestedPostTable(pool);
    await createNotificationTable(pool);
    await createOtpTable(pool);
    await createDiaryNotesTable(pool);
}
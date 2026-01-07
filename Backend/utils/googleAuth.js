import { Google } from "arctic";
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GOOGLE_OAUTH_ID;
const clientSecret = process.env.GOOGLE_OAUTH_SECRET;

const redirectURI = process.env.GOOGLE_REDIRECT_URI;
export const google = new Google(clientId, clientSecret, redirectURI);
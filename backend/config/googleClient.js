// backend/config/googleClient.js
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

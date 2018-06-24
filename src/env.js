// This fixes a load order issue that would break .env. Simply loading dotenv in index.js and configuring
// it there wouldn't work as the imported files seem to be resolved first. Doing this in a separate file
// and importing that file first seems to fix that.

import dotenv from 'dotenv';
dotenv.config();

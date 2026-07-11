// Loads .env.test before every test file so DATABASE_URL, JWT_SECRET, etc.
// point at the lotwise_test database for the entire Jest process.
//
// override: true is required — without it, dotenv silently skips any variable
// that is already set in the shell environment. This caused truncateTables()
// and the app's Prisma client to connect to different databases when
// DATABASE_URL was already set externally.
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test'), override: true });


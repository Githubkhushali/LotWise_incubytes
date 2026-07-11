// Loads .env.test before every test file so DATABASE_URL, JWT_SECRET, etc.
// point at the lotwise_test database for the entire Jest process.
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

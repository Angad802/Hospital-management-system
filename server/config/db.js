import pg from "pg";
import dotenv from "dotenv"

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:zBKEIiylJWCHdMVuDBXvcfuFZNiBQCvQ@nozomi.proxy.rlwy.net:47272/railway";

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
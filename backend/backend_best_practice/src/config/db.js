import pg from 'pg';
import dotnev from 'dotenv';
dotnev.config()

const { Pool } =pg;

const Pool =new Pool({
connectionString: process.env.DATABASE_URL,

});

export default Pool;



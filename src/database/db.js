import {Pool} from 'pg';
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from '../config/env.js';

const pool = new Pool({
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: PGPORT || 5432,
})

pool.connect().then(() => console.log('Connected to Postgresql (development')).catch(err => console.error('Database connection error: ', err.stack));

export default pool;
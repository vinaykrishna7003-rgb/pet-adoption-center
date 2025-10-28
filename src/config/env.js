import { config } from "dotenv";

config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

export const {
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    PORT,
    NODE_ENV
} = process.env


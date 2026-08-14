import dotenv from 'dotenv'

dotenv.config();

export const PORT = Number(process.env.PORT) || 5000 ;
export const MONGODB_URL = process.env.MONGODB_URL
export const SECRET_KEY = process.env.SECRET_KEY || "jwtsecretkey";



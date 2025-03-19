import app from './app.js';
import { connectDB } from './db/db.js';

connectDB();
app.listen(4000);
console.log("sv run in port 4000");
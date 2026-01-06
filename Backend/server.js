import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import userProfileRoute from './routes/userProfileRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())
app.use('/api',authRoute);
app.use('/api',userProfileRoute);
app.get('/', (req, res) => {
    res.end("Hello World!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port} !`);
})
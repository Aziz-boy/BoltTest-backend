import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import chatRoute from './routes/chat.js'; // ✅ ESM import


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use('/api', chatRoute);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

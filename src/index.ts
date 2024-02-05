import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to db');
    } catch (error) {
        console.log(error);
    }
};

start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ${process.env.MONGO_URI}`);
});
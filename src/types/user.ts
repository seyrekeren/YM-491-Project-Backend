import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    userName: string;
    userType: string;
    password: string;
    subscribers?: Types.ObjectId[];
    subscribedChannels?: Types.ObjectId[];
    videos?: Types.ObjectId[];
    watchedVideos?: string[];
}

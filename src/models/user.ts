import {model, Schema, Types} from 'mongoose';
import { IUser } from "../types/user";
import { PasswordService } from '../services/password-service';

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'user', 'teacher' ],
        default: 'user',
        required: false,
    },
    subscribers: [
        { type: Types.ObjectId, ref: 'User', required: false },
    ],
    subscribedChannels: [
        { type: Types.ObjectId, ref: 'User', required: false },
    ],
    videos: [
        { type: Types.ObjectId, ref: 'Video', required: false },
    ],
    watchedVideos: [{ type: String, required: false }],
});


userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await PasswordService.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

const User = model<IUser>('User', userSchema)

export {User}

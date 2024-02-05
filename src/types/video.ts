import { Document } from 'mongoose';
import { IUser } from './user';
import { IVideoComment } from "./video-comment";
import { IChannel } from './channel';

export interface IVideo extends Document{
    title: string;
    description: string;
    url: string;
    channel: IChannel['_id'];
    likes: Array<IUser['_id']>;
    dislikes: Array<IUser['_id']>;
    comments: IVideoComment[];
    views: number;
    S3_url: string;
}
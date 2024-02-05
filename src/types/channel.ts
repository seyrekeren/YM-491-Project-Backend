import {Document} from "mongoose";
import {IUser} from "./user";
import {IVideo} from "./video";

export interface IChannel extends Document {
    name: string;
    owner: IUser['_id'];
    videos: Array<IVideo['_id']>;
    subscriber: IUser['_id'][];  // <--- Bu satırı da değiştirdik
}
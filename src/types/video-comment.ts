import {IUser} from "./user";

export interface IVideoComment {
    user: IUser['_id'];
    text: string;
}
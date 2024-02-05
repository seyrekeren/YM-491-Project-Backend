import {model, Schema} from "mongoose";
import {IChannel} from "../types/channel";


const channelSchema = new Schema<IChannel>({
    name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriber: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
});


const Channel = model<IChannel>('Channel', channelSchema);

export {Channel}
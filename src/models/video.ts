import { model, Schema, Document, Types } from "mongoose";
import { IVideo } from "../types/video";

const videoSchema: Schema<IVideo & Document> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false},
    url: { type: String, required: true },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
    }],
    views: { type: Number, default: 0 },
    S3_url: { type: String }
},{
    timestamps:true
});

const Video = model<IVideo & Document>('Video', videoSchema);

export { Video };

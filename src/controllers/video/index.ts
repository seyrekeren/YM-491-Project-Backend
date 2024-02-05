import {Request, Response} from 'express';
import mongoose, {Types} from 'mongoose';
import {uploadVideo_AWS_S3} from '../../services/aws-service';
import {Video} from '../../models/video';
import {generateShortID} from "../../services/generate";
import {Channel} from "../../models/channel";
import {User} from '../../models/user';
import jwt from "jsonwebtoken";
import fs from "fs";


export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const { title, description, channelId } = req.body;



        const uploaded = req.file;

        console.log(token)
        console.log(uploaded)
        console.log(req.body)
        console.log(title,description,channelId)


        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const privateKey = fs.readFileSync('./secrets/private.key', 'utf8');

        const decodedToken = jwt.verify(token, privateKey) as { userType: string } ;
        const currentUserType = decodedToken?.userType;


        console.log(decodedToken)
        console.log(currentUserType)

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(400).json({ message: 'Kanal bulunamadı' });
        }

        if (currentUserType !== "admin") {
            console.log("1");
            return res.status(403).json({ message: 'Yetkisiz işlem' });
        }

        if (!uploaded) {
            console.log("2");
            return res.status(400).json({ message: 'Lütfen video ekleyiniz' });
        }

        if (!title) {
            console.log("3");
            return res.status(400).json({ message: 'Video ünvanı gerekli' });
        }

        if(!description){
            console.log("4");
            return res.status(400).json({ message: 'Video açıklaması gerekli'});
        }

        const video = await Video.create({
            title,
            description,
            url: generateShortID(),
            channel: new mongoose.Types.ObjectId(channelId),
        });

        //const fileBuffer: Buffer = Buffer.from(file, 'base64');

        video.S3_url = await uploadVideo_AWS_S3(video._id.toString(), uploaded.buffer);
        await video.save();

        channel.videos.push(video._id);
        await channel.save();

        return res.status(201).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Video yüklenemedi' });
    }
};

export const viewVideo = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.videoId;
        const video = await Video.findById(videoId);
        const currentUserId = req.currentUser?.id;

        const user = await User.findById(currentUserId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        if (!video) {
            return res.status(404).json({ message: 'Video bulunamadı' });
        }

        if (user?.watchedVideos?.includes(video.S3_url)) {
            return res.status(200).json({
                url: video.S3_url,
                message: 'Video zaten izlemişsin'
            });
        }
        user.watchedVideos?.push(video.S3_url);
        await user.save();

        video.views += 1;
        await video.save();

        return res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Hata alındı' });
    }
}

export const videoViewCount = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.videoId;
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video bulunamadı' });
        }

        return res.status(200).json({ viewCount: video.views });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hata bulundu' });
    }
}

export const listMobileAppVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const channelId = new Types.ObjectId("65b57014202e290a12b78c87");

        const videos = await Video.find({ channel: channelId }).populate('likes dislikes comments.user').sort({ createdAt: -1});

        const formattedVideos = videos.map(video => ({
            title: video.title,
            description: video.description,
            S3_url: video.S3_url,
        }));

        res.status(200).json({ videos: formattedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Kanal videoları listelenirken bir hata oluştu.' });
    }
};

export const veriBilimiVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const channelId = new Types.ObjectId("65b57000202e290a12b78c84");

        const videos = await Video.find({ channel: channelId }).populate('likes dislikes comments.user').sort({ createdAt: -1});

        const formattedVideos = videos.map(video => ({
            title: video.title,
            description: video.description,
            S3_url: video.S3_url,
        }));

        res.status(200).json({ videos: formattedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Kanal videoları listelenirken bir hata oluştu.' });
    }
};

export const webGelistirmeVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const channelId = new Types.ObjectId("65b56fd5202e290a12b78c7e");

        const videos = await Video.find({ channel: channelId }).populate('likes dislikes comments.user').sort({ createdAt: -1});

        const formattedVideos = videos.map(video => ({
            title: video.title,
            description: video.description,
            S3_url: video.S3_url,
        }));

        res.status(200).json({ videos: formattedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Kanal videoları listelenirken bir hata oluştu.' });
    }
};

export const oyunGelistirmeVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const channelId = new Types.ObjectId("65b56feb202e290a12b78c81");

        const videos = await Video.find({ channel: channelId }).populate('likes dislikes comments.user').sort({ createdAt: -1});

        const formattedVideos = videos.map(video => ({
            title: video.title,
            description: video.description,
            S3_url: video.S3_url,
        }));

        res.status(200).json({ videos: formattedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Kanal videoları listelenirken bir hata oluştu.' });
    }
};
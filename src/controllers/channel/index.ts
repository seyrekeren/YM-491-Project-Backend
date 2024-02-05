import { Request, Response } from "express";

import { Channel } from "../../models/channel";
import { User } from "../../models/user";

export const createChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = req.currentUser?.userType;
        const userId = req.currentUser?.id;
        const { name } = req.body;
        const existingChannel = await Channel.findOne({ name });

        if (!name) {
            res.status(400).json({ message: 'Lütfen tüm bilgileri eksiksiz giriniz' });
            return;
        }
        
        if (userRole !== 'admin') {
            res.status(403).json({ message: 'Yetkisiz işlem' });
            return;
        }

        if (existingChannel) {
            res.status(400).json({ message: 'Bu kanala ait isim bulunuyor.' });
            return;
        }

        const channel = new Channel({ name, owner: userId });
        await channel.save();

        res.status(201).json({ message: `Başarıyla ${name} kanalı oluşturuldu` })
    } catch (error) {
        res.status(500).json({ message: 'Kanal oluşturalamadı' });
    }
};

export const updateChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.currentUser?.id;
        const channelId = req.params.channelId;
        const { name } = req.body;
        
        if (!name) {
            res.status(400).json({ message: 'Lütfen tüm bilgileri eksiksiz giriniz' });
            return;
        }

        const channel = await Channel.findById(channelId);

        if (!channel) {
            res.status(404).json({ message: 'Kanal bulunamadı.' });
            return;
        }

        if (channel.owner.toString() !== userId) {
            res.status(403).json({ message: 'Yetkisiz işlem' });
            return;
        }
        if (name && name !== channel.name) {
            const existingChannel = await Channel.findOne({ name });
            if (existingChannel) {
                res.status(400).json({ message: 'Kanal ismi zaten aynı' });
                return;
            }
        }
        channel.name = name || channel.name;
        await channel.save();

        res.status(200).json({ message: 'Kanal başarıyla güncellendi.' });
    } catch (error) {
        res.status(500).json({ message: 'Kanal güncellenemedi' });
    }
};

export const deleteChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.currentUser?.id;
        const channelId = req.params.channelId;

        const channel = await Channel.findById(channelId).exec();

        if (!channel) {
            res.status(404).json({ message: 'Kanal bulunamadı' });
            return;
        }

        if (channel.owner.toString() !== userId) {
            res.status(403).json({ message: 'Yetkisiz işlem' });
            return;
        }
        await channel.deleteOne();
        res.status(200).json({ message: 'Kanal Başarıyla Silindi' })

    } catch (error) {
        res.status(500).json({ message: 'Kanal Silinemedi.' });
    }
};

export const subscribedChannels = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.currentUser?.id;
        const channelId = req.params.channelId;

        const channel = await Channel.findById(channelId);
        const user = await User.findById(userId);
        const channelName = channel?.name;

        if (!channel) {
            res.status(404).json({ message: 'Kanal bulunamadı' });
            return;
        }

        if(channel.subscriber.includes(userId))
        {
            res.status(400).json({message: 'Kullanıcı zaten abone'});
            return;
        }

        channel.subscriber.push(userId);
        await channel.save();

        user?.subscribedChannels?.push(channel.id);
        await user?.save();

        res.status(200).send({ message: `Başarıyla ${channelName} kanalına abone olundu` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Kanal abone olunamadı.' });
    }
};

export const unsubscribeChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const channelId = req.params.channelId;
        const currentUser = req.currentUser;

        const channel = await Channel.findById(channelId);
        const userId = currentUser?.id;

        if (!channel) {
            res.status(404).json({ message: 'Kanal bulunamadı.' });
            return;
        }

        if (!channel.subscriber.includes(userId)) {
            res.status(400).send('Kanala zaten abone değilsiniz');
            return;
        }

        await Channel.findByIdAndUpdate(channelId, {
            $pull: { subscriber: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { subscribedChannels: channelId }
        });

        res.status(200).send({ message: 'Abonelikten başarıyla çıkıldı' });
    } catch (error) {
        console.error('Error unsubscribing from the channel:', error);
        res.status(500).json({ message: 'Abonelikten çıkılamadı.' });
    }
};


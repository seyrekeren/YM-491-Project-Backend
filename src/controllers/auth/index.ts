import { User } from '../../models/user'
import { JwtService } from '../../services/jwt-service';
import { PasswordService } from '../../services/password-service';
import {Request, Response} from "express";

export const signup = async (req: Request, res: Response) => {
    const {userName, password, email, userType  } = req.body;

    if (!userName || !password || !email ) {
        return res.status(400).json({ message: 'Lütfen tüm bilgileri eksiksiz giriniz' });
    }

    let existingUser = await User.findOne({ userName }).exec();

    if (existingUser) {
        return res.status(500).json({message: 'Username is in use'})
    }

    existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
        return res.status(500).json({message: 'Email is in use'})
    }

    const user = await User.create({
        userName,
        email,
        password,
        userType
    });
    await user.save();

    const userJwt = JwtService.sign(
        { id: user._id, email: user.email, username: user.userName, userType: user.userType },
        'Hello'
    );

    req.session = {
        jwt: userJwt,
    };

    res.status(201).send({ message: 'Kayıt ol başarılı'});
};

export const login = async (req: Request, res: Response) => {
    const { userName, password } = req.body;

    const existingUser = await User.findOne({ userName }).exec();
    if (!existingUser) {
        return res.status(500).json({ message: 'Kullanıcı bulunamadı' });
    }

    const passwordsMatch = await PasswordService.compare(existingUser.password, password);
    if (!passwordsMatch) {
        return res.status(500).json({ message: 'Şifre eşleşmiyor' });
    }

    const userJwt = JwtService.sign(
        { id: existingUser._id, email: existingUser.email, username: existingUser.userName, userType: existingUser.userType},
        'Hello'
    );

    req.session = {
        jwt: userJwt,
    };

    res.cookie('jwt', userJwt, { httpOnly: true });
    res.status(200).json({
        message: 'Başarıyla giriş yapıldı.',
        user: {
            id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
            userType: existingUser.userType,
        },
        token: userJwt,
    });
};

export const logout = (req: Request, res: Response) => {
    req.session = null;
    res.status(500).json({ message: 'Başarıyla çıkış yapıldı' });
};

export const currentUser = (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null})
}

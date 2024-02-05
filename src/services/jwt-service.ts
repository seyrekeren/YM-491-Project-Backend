import fs from 'fs';
import jwt from 'jsonwebtoken';
import { IUserPayload} from "../types/user-payload";

const privateKey = fs.readFileSync('./secrets/private.key', 'utf8');
const publicKey = fs.readFileSync('./secrets/public.key', 'utf8');

export class JwtService {
    static issuer = 'asbaşaran'; //companyName

    static audience = 'www.asbaşaran.com.tr'; //companyUrl

    static expiresIn = '5d';

    static algorithm: jwt.Algorithm = 'RS256';

    static sign(payload: IUserPayload, subject: string) {
        const signOptions: jwt.SignOptions = {
            issuer: this.issuer,
            subject,
            audience: this.audience,
            expiresIn: this.expiresIn,
            algorithm: this.algorithm,
        };
        return jwt.sign(payload, privateKey, signOptions);
    }


    static verify(token: string) {
        const verifyOptions: jwt.VerifyOptions = {
            issuer: this.issuer,
            audience: this.audience,
            algorithms: [this.algorithm],
        };

        try {
            return jwt.verify(token, publicKey, verifyOptions);
        } catch (err) {
            return false;
        }
    }

    static decode(token: string) {
        return jwt.decode(token, { complete: true });
    }
}
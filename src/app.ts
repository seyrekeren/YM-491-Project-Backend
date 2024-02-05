import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { json } from 'body-parser';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import router from './routes';

const app = express();

app.use(
    cors({
        origin:true,
        credentials:true
    })
)

app.use(express.json());
app.use(cookieParser());
app.use(json());
app.use(helmet());


app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
)

app.use('/api', router);

app.all('*', async (req: Request, res: Response) => {
    return res.sendStatus(404);
});

export { app };
import { Router } from 'express';
import {createChannel, updateChannel, subscribedChannels, unsubscribeChannel, deleteChannel} from "../../controllers/channel";
import {
    uploadVideo,
    videoViewCount,
    viewVideo,
    listMobileAppVideos,
    veriBilimiVideos,
    webGelistirmeVideos, oyunGelistirmeVideos
} from '../../controllers/video';

import multer from 'multer';
const upload = multer();

const router: Router = Router();

router.post('/', createChannel);
router.put('/:channelId', updateChannel);
router.post('/:channelId/subscribe', subscribedChannels);
router.post('/:channelId/unsubscribe', unsubscribeChannel);
router.delete('/:channelId', deleteChannel);

//video route
router.post('/upload-video', upload.single('file'), uploadVideo);
router.post('/:channelId/:videoId', videoViewCount);
router.get('/:channelId/:videoId', viewVideo);

router.get('/listMobileAppVideos', listMobileAppVideos);
router.get('/listVeriBilimiVideos' ,veriBilimiVideos);
router.get('/oyungelistirmeVideos', oyunGelistirmeVideos);
router.get('/webGelistirmeVideos', webGelistirmeVideos);

export { router as channelRouter };
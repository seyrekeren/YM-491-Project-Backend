import {Router} from "express";

import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

import { authRouter } from "./auth";
import { channelRouter } from "./channel";

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/channel', channelRouter);

export default router;
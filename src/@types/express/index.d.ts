import {IUserPayload} from "../../types/user-payload";

declare global {
    namespace Express {
        interface Request {
            currentUser?: IUserPayload;
        }
    }
}


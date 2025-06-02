// src/@types/express/index.d.ts

import { User } from '../../types/user.interface'; // Replace with actual type if you have one

declare module 'express' {
    export interface Request {
        user?: User; // or user?: any; if you're unsure of the shape
    }
}

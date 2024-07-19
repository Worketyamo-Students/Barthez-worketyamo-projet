import jwt from 'jsonwebtoken'
import { key } from '../core/config/env';

interface Jwtpayload {
    user_id?: string;
    name: string;
    email: string;
    password: string;
    role: string
}

const UserToken = {
    createAccessToken: (payload: Jwtpayload) => {
        const signOption = {expiresIn: '1h'}
        return jwt.sign(payload, key.ACCESS_TOKEN_SECRET, signOption);
    },

    verifyAccessToken: (token: string) => {
        try {
            return jwt.verify(token, key.ACCESS_TOKEN_SECRET) as Jwtpayload
        } catch (error) {
            console.error(`Invalid access token: ${token} !`);            
        }
    },

    decodeAccessToken: (payload: string) => {
        try {
            return jwt.decode(payload);
        } catch (error) {
            console.error(`Une erreur est survenu lors du decodage: ${error}`)
        }
    },

    createRefreshToken: (payload: Jwtpayload) => {
        const signOption = {expiresIn: '30d'}
        return jwt.sign(payload, key.REFRESH_TOKEN_SECRET, signOption)
    },

    verifyRefreshToken: (token: string) => {
        try {
            return jwt.verify(token, key.REFRESH_TOKEN_SECRET) as Jwtpayload;
        } catch (error) {
            console.error(`Invalid access token: ${error} !`);
        }
    },

    decodeRefreshToken : (token: string) => {
        try {
            return jwt.decode(token);
        } catch (error) {
            console.log(`erreur: ${error}`);
        }
    }
}

export default UserToken;
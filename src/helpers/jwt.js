import {
    redisHSetObjectAsync,
} from '../config/redis';
import Config from '../config';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';

export const raffinierenToken = (t, p = 'Bearer ') => t.startsWith(p) ? t.slice(p.length, t.length) : t; // todo rename this shit

export const generateJWT = (data, key) => new Promise((res, rej) => {
    const tokenLifeTime = Number(Config.jwt_lifetime); // todo add to env file / constant
    const refreshTokenLifeTime = Number(Config.jwt_refresh_lifetime); // todo add to env file / constant
    const secret = uuid();
    const secretRefresh = uuid();
    const sessionKey = key ? key : `session:${data.userId}:${uuid()}`;

    redisHSetObjectAsync(sessionKey, {
        accessToken: secret,
        refreshToken: secretRefresh,
    }).then(() => {
        const created_at = +new Date();
        const expires_at = created_at + (tokenLifeTime * 1000);

        const token = jwt.sign({
            ...data,
            sessionKey,
        }, secret, {
            expiresIn: tokenLifeTime
        });

        const refreshToken = jwt.sign({
            ...data,
            sessionKey,
        }, secretRefresh, {
            expiresIn: refreshTokenLifeTime
        });

        res({
            access_token: token,
            refresh_token: refreshToken,
            created_at,
            expires_at,
        });
      })
      .catch(() => {
          rej('Redis error')
      });
});


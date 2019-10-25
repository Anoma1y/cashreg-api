import DB from "../config/db";
import { 
  redisDelAsync, 
  redisHgetAllAsync, 
  redisHincrbyAsync, 
  redisHsetAsync, 
  redisKeysAsync,
  redisHgetAsync,
  redisGetAsync,
} from "../config/redis";
import STATUS_CODES from "../helpers/statusCodes";
import { HttpError } from "../helpers/errorHandler";
import { generateJWT } from "../helpers/jwt";
import {
  getCurrentTimestamp,
  verifyPassword
} from "../helpers/index";
import ACTION_CODES from "../helpers/actionCodes";
import jwt from 'jsonwebtoken';
import { raffinierenToken } from '../helpers/jwt';

class AuthService {
  genAuthToken = async (userId, key = null) => {
    const tokenPayload = {
      userId
    };
    
    const authToken = await generateJWT(tokenPayload, key);

    return {
      authToken,
    };
  };

  login = async (email, password, remoteAddress) => {
    const user = await DB.User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const loginAttemptKey = `login-attempt:${user.id}`;

    const loginBlock = await redisHgetAllAsync(loginAttemptKey);

    if (loginBlock) {
      const { attempt, time: expiresAt } = loginBlock;

      const now = new Date().getTime();
      const untilTime = new Date(Math.round(new Date(Number(expiresAt)).getTime()) + (5 * 60 * 1000)).getTime();

      if (now > untilTime) {
        await redisDelAsync(loginAttemptKey)
      } else {
        const difference = untilTime - now;

        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const totalSeconds = (minutes * 60) + seconds;

        if (attempt >= 3) {
          throw new HttpError(ACTION_CODES.USER_BANNED, STATUS_CODES.FORBIDDEN, { ban_period: totalSeconds });
        }
      }
    }

    const currentTime = getCurrentTimestamp();

    const isVerifyPassword = await verifyPassword(password, user.password);

    if (isVerifyPassword) {
      await DB.SessionHistory.create({
        user_id: user.id,
        user_ip: remoteAddress
      });

      return await this.genAuthToken(user.id);
    } else {
      if (!loginBlock) {
        await redisHsetAsync(loginAttemptKey, 'attempt', 1, 'time', currentTime);
      } else {
        await redisHsetAsync(loginAttemptKey, 'time', currentTime);
        await redisHincrbyAsync(loginAttemptKey, 'attempt', 1)
      }

      throw new HttpError(ACTION_CODES.INVALID_LOGIN_OR_PASS, STATUS_CODES.FORBIDDEN);
    }
  };

  refreshToken = async (refreshToken) => {
    const token = raffinierenToken(refreshToken); // todo add constant for prefix token
    const decode = jwt.decode(token); // todo add check
    
    const secret = await redisHgetAsync(decode.sessionKey, 'refreshToken');

    try {
      await jwt.verify(token, secret);

      return await this.genAuthToken(decode.userId, decode.sessionKey);
    } catch (e) {
      throw new HttpError(ACTION_CODES.AUTHORIZATION_TOKEN_NOT_CORRECT, STATUS_CODES.FORBIDDEN)
    }
  };

  logout = async (sessionKey) => {
    await redisDelAsync(sessionKey);

    return true;
  };

  logoutOfAllSessions = async (userId) => {
    const sessionKeys = await redisKeysAsync(`session:${userId}:*`);
    await Promise.all(sessionKeys.map((key) => redisDelAsync(key)));

    return true;
  }
}

export default new AuthService();

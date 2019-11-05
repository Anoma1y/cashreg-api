import Sequelize from 'sequelize';
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

const BANNED_TIME = 2 * 60 * 1000;
const ATTEMPTS_TO_BAN = 5;

class AuthService {
  genAuthToken = async (userId, key = null) => {
    const tokenPayload = {
      userId
    };

    return generateJWT(tokenPayload, key)
  };

  checkUserAndVerify = async email => {
    return DB.User.findOne({
      where: {
        email,
      },
      plain: true,
      include: [{
        model: DB.Profile,
        attributes: ['is_email_verified'],
      }]
    })
  };

  login = async (email, password, remoteAddress) => {
    const user = await this.checkUserAndVerify(email);

    if (!user) {
      throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    } else if (!user.profile.is_email_verified) {
      throw new HttpError(ACTION_CODES.ACTIVATION_REQUIRED, STATUS_CODES.IM_A_TEAPOT);
    }

    const loginAttemptKey = `login-attempts:${user.id}`;

    const loginBlock = await redisHgetAllAsync(loginAttemptKey);

    if (loginBlock) {
      const { attempts, time: expiresAt } = loginBlock;

      const now = new Date().getTime();
      const untilTime = new Date(Math.round(new Date(Number(expiresAt)).getTime()) + (BANNED_TIME)).getTime();

      if (now > untilTime) {
        await redisDelAsync(loginAttemptKey)
      } else {
        const difference = untilTime - now;

        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const totalSeconds = (minutes * 60) + seconds;

        if (attempts >= ATTEMPTS_TO_BAN) {
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

      return this.genAuthToken(user.id);
    } else {
      if (!loginBlock) {
        await redisHsetAsync(loginAttemptKey, 'attempts', 1, 'time', currentTime);
      } else {
        await redisHsetAsync(loginAttemptKey, 'time', currentTime);
        await redisHincrbyAsync(loginAttemptKey, 'attempts', 1)
      }

      throw new HttpError(ACTION_CODES.INVALID_LOGIN_OR_PASS, STATUS_CODES.UNAUTHORIZED);
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

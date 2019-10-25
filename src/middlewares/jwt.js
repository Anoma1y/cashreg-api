import jwt from 'jsonwebtoken';
import { redisHgetAsync } from '../config/redis';
import { HttpError, setResponseError } from '../helpers/errorHandler';
import { raffinierenToken } from '../helpers/jwt';
import STATUS_CODES from '../helpers/statusCodes';
import ACTION_CODES from '../helpers/actionCodes';

const TOKEN_PREFIX = 'Bearer ';

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    try {
      const token = raffinierenToken(authorization, TOKEN_PREFIX);
      const decode = jwt.decode(token);
      const secret = await redisHgetAsync(decode.sessionKey, 'accessToken');

      jwt.verify(token, secret, (err, verifyDecoded) => {
        if (err) throw new HttpError(ACTION_CODES.AUTHORIZATION_TOKEN_NOT_CORRECT, STATUS_CODES.FORBIDDEN);

        if (verifyDecoded) {
          req.decoded = verifyDecoded;
          next();
        }
      });
    } catch (err) {
      setResponseError(res, err);
    }
  } else {
    setResponseError(res, {
      action: ACTION_CODES.AUTHORIZATION_HEADER_NOT_PRESENT,
      status: STATUS_CODES.FORBIDDEN,
      extra: {}
    });
  }
};

export { checkToken };

import jwt from 'jsonwebtoken';
import { redisHgetAsync } from '../config/redis';
import { setResponseError } from '../services/errors';
import { raffinierenToken } from '../helpers/jwt';
import { HTTP_STATUS, ACTION_CODE } from '../constants';

const TOKEN_PREFIX = 'Bearer ';

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return setResponseError(res, { action: ACTION_CODE.AUTHORIZATION_HEADER_NOT_PRESENT, status: HTTP_STATUS.UNAUTHORIZED });
  }

  const token = raffinierenToken(authorization, TOKEN_PREFIX);
  const decode = jwt.decode(token);

  if (!decode) return setResponseError(res, { action: ACTION_CODE.AUTHORIZATION_TOKEN_NOT_CORRECT, status: HTTP_STATUS.FORBIDDEN });

  const secret = await redisHgetAsync(decode.sessionKey, 'accessToken');

  jwt.verify(token, secret, (err, verifyDecoded) => {
    if (err) return setResponseError(res, { action: ACTION_CODE.AUTHORIZATION_TOKEN_NOT_CORRECT, status: HTTP_STATUS.FORBIDDEN });

    if (verifyDecoded) {
      req.decoded = verifyDecoded;
      next();
    }
  });
};

export { checkToken };

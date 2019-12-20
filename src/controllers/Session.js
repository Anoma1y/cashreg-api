import {
  setResponseError, 
  checkValidationErrors,
} from "../services/errors";
import AuthService from '../services/auth';
import { HTTP_STATUS, ACTION_CODE } from '../constants';

class Session {
  login = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { body, connection } = req;

      const data = await AuthService.login(
        body.email,
        body.password,
        connection.remoteAddress || 'Unknown'
      );
      
      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.AUTHORIZATION_TOKEN_CREATED,
        data
      })
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  refreshToken = async (req, res) => {
    try {
      await checkValidationErrors(req);
  
      const data = await AuthService.refreshToken(req.body.refreshToken);
      
      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.AUTHORIZATION_TOKEN_REFRESHED,
        data
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  logout = (req, res) =>
    AuthService.logout(req.decoded.sessionKey)
      .then(() => res.status(HTTP_STATUS.NO_CONTENT).send())
      .catch(() => setResponseError(res));

  logoutOfAllSessions = (req, res) =>
    AuthService.logoutOfAllSessions(req.decoded.userId)
      .then(() => res.status(HTTP_STATUS.NO_CONTENT).send())
      .catch(() => setResponseError(res))
}

export default new Session();

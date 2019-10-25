import STATUS_CODES from "../helpers/statusCodes";
import { 
  setResponseError, 
  checkValidationErrors,
} from "../helpers/errorHandler";
import AuthService from '../services/auth';
import ACTION_CODES from "../helpers/actionCodes";

class Session {
  login = async (req, res) => {
    try {
      await checkValidationErrors(req);
      
      const {
        body: {
          email,
          password
        },
        connection: {
          remoteAddress
        }
      } = req;
      
      const data = await AuthService.login(email, password, remoteAddress || 'Unknown');
      
      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.AUTHORIZATION_TOKEN_CREATED,
        data
      })
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  refreshToken = async (req, res) => {
    try {
      await checkValidationErrors(req);
  
      const {
        refreshToken,
      } = req.body;
      
      const data = await AuthService.refreshToken(refreshToken);
      
      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.AUTHORIZATION_TOKEN_REFRESHED,
        data
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  logout = (req, res) => {
    const { sessionKey } = req.decoded;

    AuthService.logout(sessionKey)
      .then(() => res.status(STATUS_CODES.NO_CONTENT).send())
      .catch(() => setResponseError(res));
  };

  logoutOfAllSessions = (req, res) => {
    AuthService.logoutOfAllSessions(req.decoded.userId)
      .then(() => res.status(STATUS_CODES.NO_CONTENT).send())
      .catch(() => setResponseError(res))
  }
}

export default new Session();

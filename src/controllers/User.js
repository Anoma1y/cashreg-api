import STATUS_CODES from '../helpers/statusCodes';
import {
  setResponseError,
  checkValidationErrors
} from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';
import RegistrationService from '../services/registration';
import PasswordService from '../services/password';

class User {
  checkEmailExist = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { email } = req.body;

      const isExist = await RegistrationService.checkExist(email);

      return res.status(!isExist ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND).send()
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createUser =  async (req, res) => {
    try {
      await checkValidationErrors(req);
      
      const { login, email, password } = req.body;
      
      await RegistrationService.createUser({ email, login, password });
      
      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.USER_CREATED
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  userVerify = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { user_id } = req.params;
      const { token, token_id } = req.body;

      await RegistrationService.verify(user_id, token, Number(token_id));

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.VERIFY_SUCCESS
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  resetPasswordStepOne = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { email } = req.query;

      await PasswordService.resetPasswordStepOne(email);

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_RESET_SEND_EMAIL
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  resetPasswordStepTwo = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { user_id } = req.params;
      const { token, token_id, password } = req.body;

      await PasswordService.resetPasswordStepTwo(user_id, token, Number(token_id), password );

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_RESET_SUCCESSFUL
      })
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  changePassword = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { newPassword, currentPassword } = req.body;
      const { sessionKey, userId } = req.decoded;

      const data = await PasswordService.changePassword(sessionKey, userId,  newPassword, currentPassword );

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_CHANGE_SUCCESSFUL,
        data
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  }
}

export default new User();

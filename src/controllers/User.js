import STATUS_CODES from '../helpers/statusCodes';
import {
  setResponseError,
  checkValidationErrors
} from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';
import RegistrationService from '../services/registration';

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
}

export default new User();

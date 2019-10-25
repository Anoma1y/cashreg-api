import Session from '../../controllers/Session';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/session';

const router = require('express').Router();

router.post('/', Validation.login, Session.login);
router.post('/refresh', Validation.refreshToken, Session.refreshToken); // todo add validation for refresh  token

router.delete('/', checkToken, Session.logout);
router.delete('/all', checkToken, Session.logoutOfAllSessions);

export default router;

const router = require('express').Router();
import Session from './session';
import File from './file';
import User from './user';
import Me from './me';
import Category from './category';
import Contragent from './contragent';

router.use('/session', Session);
router.use('/file', File);
router.use('/user', User);
router.use('/me', Me);
router.use('/category', Category);
router.use('/contragent', Contragent);

export default router;

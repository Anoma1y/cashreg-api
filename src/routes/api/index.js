const router = require('express').Router();
import SessionRouter from './session';
import FileRouter from './file';
import UserRouter from './user';
import MeRouter from './me';
import CurrencyRouter from './currency';
import PermissionRoute from './permission';
import WorkspaceRoute from './workspace';

router.use('/session', SessionRouter);
router.use('/file', FileRouter);
router.use('/user', UserRouter);
router.use('/me', MeRouter);
router.use('/currency', CurrencyRouter);
router.use('/permission', PermissionRoute);
router.use('/workspace', WorkspaceRoute);

export default router;

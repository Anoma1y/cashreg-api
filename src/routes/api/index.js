const router = require('express').Router();
import SessionRouter from './session';
import FileRouter from './file';
import UserRouter from './user';
import MeRouter from './me';
import CategoryRouter from './category';
import ContragentRouter from './contragent';
import CurrencyRouter from './currency';
import TransactionRouter from './transaction';
import CashRouter from './cash';

router.use('/session', SessionRouter);
router.use('/file', FileRouter);
router.use('/user', UserRouter);
router.use('/me', MeRouter);
router.use('/category', CategoryRouter);
router.use('/contragent', ContragentRouter);
router.use('/currency', CurrencyRouter);
router.use('/transaction', TransactionRouter);
router.use('/cash', CashRouter);

export default router;

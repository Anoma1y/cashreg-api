import Transaction from '../../controllers/Transaction';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/transaction';

const router = require('express').Router();

router.get('/', checkToken, Transaction.getTransactionList);
router.get('/summary', checkToken, Transaction.getSummary);

export default router;

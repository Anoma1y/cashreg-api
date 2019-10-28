import Transaction from '../../controllers/Transaction';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/transaction';

const router = require('express').Router();

router.get('/', checkToken, Transaction.getTransactionList);
router.get('/:transaction_id', checkToken, Transaction.getTransactionSingle);
router.post('/:workspace_id', checkToken, Validation.createTransaction, Transaction.createTransaction);
router.patch('/:workspace_id/:transaction_id', checkToken, Transaction.editTransaction);
router.delete('/:transaction_id', checkToken, Transaction.deleteTransaction);

router.get('/summary', checkToken, Transaction.getSummary);

export default router;

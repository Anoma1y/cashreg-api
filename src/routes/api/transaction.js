import Transaction from '../../controllers/Transaction';

const router = require('express').Router();

router.get('/', Transaction.getTransactionList);

export default router;

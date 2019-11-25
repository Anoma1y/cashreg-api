import Transaction from '../../../controllers/Transaction';
import { checkToken } from '../../../middlewares/jwt';
import Validation from '../validation/transaction';
import Permissions from '../../../middlewares/permissions';

const router = require('express').Router({ mergeParams: true, });

router.get('/',
	checkToken,
	Permissions.can(),
	Transaction.getTransactionList
);

router.get('/:transaction_id',
	checkToken,
	Permissions.can(),
	Transaction.getTransactionSingle
);

router.post('/',
	checkToken, Validation.createTransaction,
	Transaction.createTransaction
);

router.post('/:transaction_id/invalidate',
	checkToken,
	Transaction.invalidateTransaction
);

router.patch('/:transaction_id',
	checkToken,
	Transaction.editTransaction
);


router.get('/summary', checkToken, Transaction.getSummary);

export default router;

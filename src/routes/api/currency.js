import Currency from '../../controllers/Currency';

const router = require('express').Router();

router.get('/', Currency.getCurrencyList);
router.get('/:currency_id', Currency.getCurrencySingle);

export default router;

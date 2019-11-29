import { getPagination } from '../helpers/pagination';
import { getMultipleQueryValues, getMultipleOrder } from '../helpers/sql';
import STATUS_CODES from '../helpers/statusCodes';

class StructuredData {
	getOrder = (req) => {
		const {
			order_by_key = 'id',
			order_by_direction = 'desc',
		} = req.query;

		return getMultipleOrder(
			getMultipleQueryValues(order_by_key),
			getMultipleQueryValues(order_by_direction)
		);
	};

	withoutPagination = async (req, where, listServiceMethod) => {
		const order = this.getOrder(req);

		return listServiceMethod({
			json: true,
			where,
			order,
		});
	};

	withPagination = async (req, where, countServiceMethod, listServiceMethod) => {
		const order = this.getOrder(req);

		const total_records = await countServiceMethod(where);

		const { page, num_on_page, offset, limit } = getPagination(req, total_records);

		if (total_records === 0) {
			return {
				page: 1,
				data: [],
				num_on_page,
				total_records
			}
		}

		const data = await listServiceMethod({
			json: true,
			offset,
			limit,
			where,
			order,
		});

		return {
			page,
			data,
			num_on_page,
			total_records
		}
	}
}

export default new StructuredData();

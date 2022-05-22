import { Router } from 'express';

import orderController from '../controllers/order.controller';

const router = Router();

router.post('/', orderController.addOrder);

router.get('/', orderController.getOrders);

router.get('/:orderId', orderController.getOrder);

export default router;

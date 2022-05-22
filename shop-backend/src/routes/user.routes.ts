import { Router } from 'express';

import userController from '../controllers/user.controller';

const router = Router();

router.post('/cart', userController.addProduct);

router.put('/cart', userController.removeProduct);

router.get('/cart/:userId', userController.getCart);

router.delete('/cart/:userId', userController.clearCart);

export default router;

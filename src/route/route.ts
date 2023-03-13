import express from "express";
import user_controller from "../controllers/user_controller";
import cart_controller from "../controllers/cart_controller";
import TokenVerify from "../Validators/midelware"

const router = express.Router();

router.post('/RegisterUser', user_controller.createUser);
router.get('/LoginUser', user_controller.loginUser);

router.put('/Add-Cart/:id/:Product_id', TokenVerify.verfiyToken, cart_controller.addCart);
router.get('/GetProducts', cart_controller.getAllProduct);
router.delete('/Remove-cart/:id/:Product_id', cart_controller.removeCart);

export = router;
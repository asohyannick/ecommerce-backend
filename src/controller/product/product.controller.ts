import express from 'express';
import { createProduct, fetchProducts, fetchProduct, updateProduct, removeProduct, searchProduct } from '../../service/product/product.service';
import { authToken } from '../../middleware/auth/authToken.middleware';
import schemaValidator from '../../utils/validator/schemaValidator';
const router = express.Router();
router.post('/create-product',
    authToken,
    schemaValidator('/product/create-product'),
    createProduct
);
router.get('/fetch-products',
    authToken,
    fetchProducts
);
router.get('/fetch-product/:id',
    authToken,
    fetchProduct
);
router.put('/update-product/:id',
    authToken,
    updateProduct
);
router.delete('/remove-product/:id',
    authToken,
    removeProduct
);
router.get('/search-product',
    authToken,
    searchProduct
)
export default router;

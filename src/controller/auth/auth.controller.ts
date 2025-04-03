import express from 'express';
import { register, login, refreshAccessToken, fetchUsers, fetchUser, updateUser, removeUser } from '../../service/auth/auth.service';
import schemaValidator from '../../utils/validator/schemaValidator';
import { authToken } from '../../middleware/auth/authToken.middleware';
const router = express.Router();
router.post('/register',
    schemaValidator('/auth/register'),
    register
);
router.post('/login',
    schemaValidator('/auth/login'),
    authToken,
    login
);
router.post('/refresh-access-token',
    authToken,
    refreshAccessToken
);
router.get('/fetch-users',
    authToken,
    fetchUsers
);

router.get('/fetch-user/:id',
    authToken,
    fetchUser
);
router.put('/update-user/:id',
    authToken,
    updateUser
);
router.delete('/remove-user/:id',
    authToken,
    removeUser
);
export default router;

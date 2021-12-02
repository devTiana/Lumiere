import express from 'express';
import {
  generalLogin,
  register,
  checkEmail,
  checkPwd,
  updatePwd,
  logout,
  dropout,
  getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js'; // for private routes

const router = express.Router();

// endpoint => /api/users
router
  .route('/')
  .post(register)
  .patch(protect, dropout)
  .get(protect, admin, getUsers);
router.route('/email').post(checkEmail);
router.route('/login').post(generalLogin);
router.route('/logout').patch(protect, logout);
// router.route('/kakao').get(kakaoUserInfo);
// router.route('/google').get(googleUserInfo);
// router.route('/naver').get(naverUserInfo);

router.route('/profile').post(protect, checkPwd).patch(protect, updatePwd);

export default router;

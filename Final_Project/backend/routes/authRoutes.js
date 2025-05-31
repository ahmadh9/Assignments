// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// مسار بدء تسجيل الدخول
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// مسار العودة بعد نجاح الدخول
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;

    // توليد JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // إرسال التوكن مع بيانات المستخدم
    res.json({
      message: '✅ Logged in with Google',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
);

export default router;

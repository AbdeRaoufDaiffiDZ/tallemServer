const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middlewares/auth");

authRouter.post("/api/signup", async (req, res) => {
  try {
    console.log("req to sign up");
    const { name, email, password, tokenNt } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "جميع الحقول مطلوبة" });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: "يوجد حساب بنفس البريد الإلكتروني" });
    }
    const hashPassword = await bcryptjs.hash(password, 8);
    const user = new User({ name, email, password: hashPassword, tokenNt });
    await user.save();
    res.json({ msg: "تم التسجيل بنجاح، يرجى تسجيل الدخول" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "خطأ في الخادم، حاول لاحقًا" });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    console.log("req to sign in");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "البريد وكلمة المرور مطلوبان" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "الحساب غير موجود" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "كلمة المرور غير صحيحة" });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (error) {
    console.error("Signin error:", error.message);
    res.status(500).json({ error: "خطأ في الخادم، حاول لاحقًا" });
  }
});

authRouter.post("/token-is-valid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    const tokenNt = req.header("tokenNt");
    if (tokenNt) {
      user.tokenNt = tokenNt;
      await user.save();
    }
    res.json(true);
  } catch (error) {
    console.error("Token validation error:", error.message);
    res.status(500).json({ error: "خطأ في التحقق من التوكن" });
  }
});

authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
  } catch (error) {
    console.error("User fetch error:", error.message);
    res.status(500).json({ error: "خطأ في جلب بيانات المستخدم" });
  }
});

authRouter.post("/api/change_password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ msg: "كلمة المرور مطلوبة" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "المستخدم غير موجود" });
    }
    user.password = await bcryptjs.hash(password, 8);
    await user.save();
    res.send("تم تغيير كلمة المرور بنجاح");
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ error: "خطأ في تغيير كلمة المرور" });
  }
});

authRouter.post("/api/change_name", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "الاسم الجديد مطلوب" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "المستخدم غير موجود" });
    }
    user.name = name;
    await user.save();
    res.json({ msg: "تم تغيير الاسم بنجاح", user });
  } catch (error) {
    console.error("Change name error:", error.message);
    res.status(500).json({ error: "خطأ في تغيير الاسم" });
  }
});

module.exports = authRouter;
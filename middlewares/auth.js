const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "الوصول مرفوض، توكن غير موجود" });
    }
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      return res.status(401).json({ msg: "فشل التحقق من التوكن" });
    }
    req.user = verified.id;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({ error: "خطأ في التحقق من الهوية" });
  }
};

module.exports = auth;
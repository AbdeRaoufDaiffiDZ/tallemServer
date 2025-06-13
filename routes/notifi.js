const express = require("express");
const notifiRouter = express.Router();
const Notifi = require("../models/notification");
const admin = require("firebase-admin");
const serviceAccount = require("./dawini-cec17-firebase-adminsdk-rxmpe-e2c76000a0.json");
const User = require("../models/user");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dawini-cec17-default-rtdb.europe-west1.firebasedatabase.app",
});

async function getFCMTokens() {
  try {
    const users = await User.find({});
    if (!users.length) throw new Error("No users found");
    const fcmTokens = users.map(user => user.tokenNt).filter(token => token);
    return [...new Set(fcmTokens)]; // Remove duplicates
  } catch (error) {
    console.error("Error fetching FCM tokens:", error.message);
    throw error;
  }
}

async function sendNotification(fcmToken, title, body, data) {
  const message = {
    token: fcmToken,
    notification: { title, body },
    data,
  };
  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    if (error.code === "messaging/registration-token-not-registered") {
      await User.updateMany({ tokenNt: fcmToken }, { $unset: { tokenNt: 1 } });
      console.log("Removed invalid token:", fcmToken);
    } else {
      console.error("Error sending notification:", error.message);
    }
  }
}

notifiRouter.post("/sent_notification", async (req, res) => {
  try {
    const { title, body, type, link } = req.body;
    if (!title || !body || !type || !link || typeof title !== "string" || typeof body !== "string" || typeof type !== "string" || typeof link !== "string") {
      return res.status(400).json({ msg: "معلومات غير صحيحة" });
    }
    const fcmTokens = await getFCMTokens();
    const sendPromises = fcmTokens.map(token => sendNotification(token, title, body, { type, link }));
    await Promise.all(sendPromises);

    const notifi = new Notifi({ title, body, type, link });
    await notifi.save();
    res.status(200).json({ ...notifi._doc, msg: "تم إرسال الإشعار بنجاح" });
  } catch (error) {
    console.error("Send notification error:", error.message);
    res.status(500).json({ error: "خطأ في إرسال الإشعار" });
  }
});

notifiRouter.get("/get_notifications", async (req, res) => {
  try {
    const notifications = await Notifi.find({});
    if (!notifications.length) {
      return res.status(404).json({ msg: "لا توجد إشعارات" });
    }
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({ error: "خطأ في جلب الإشعارات" });
  }
});

module.exports = notifiRouter;
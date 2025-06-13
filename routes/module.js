const express = require("express");
const moduleRouter = express.Router();
const Subject = require("../models/module");

moduleRouter.post("/add_course", async (req, res) => {
  try {
    const { year, name, speciality, courseName, link } = req.body;
    if (!year || !name || !speciality || !courseName || !link) {
      return res.status(400).json({ msg: "جميع الحقول مطلوبة" });
    }
    let existModule = await Subject.findOne({ name, speciality, year });
    const course = { name: courseName, link };

    if (existModule) {
      existModule.courses.push(course);
      await existModule.save();
      return res.status(200).json(existModule);
    }

    const subject = new Subject({ year, name, speciality, courses: [course], exames: [] });
    await subject.save();
    res.status(200).json(subject);
  } catch (error) {
    console.error("Add course error:", error.message);
    res.status(500).json({ error: "خطأ في إضافة الدرس" });
  }
});

moduleRouter.post("/add_exame", async (req, res) => {
  try {
    const { year, name, speciality, exameName, link, solutionLink } = req.body;
    if (!year || !name || !speciality || !exameName || !link) {
      return res.status(400).json({ msg: "جميع الحقول مطلوبة" });
    }
    let existModule = await Subject.findOne({ name, speciality, year });
    const exame = { name: exameName, link, solutionLink };

    if (existModule) {
      existModule.exames.push(exame);
      await existModule.save();
      return res.status(200).json(existModule);
    }

    const subject = new Subject({ year, name, speciality, courses: [], exames: [exame] });
    await subject.save();
    res.status(200).json(subject);
  } catch (error) {
    console.error("Add exam error:", error.message);
    res.status(500).json({ error: "خطأ في إضافة الامتحان" });
  }
});

moduleRouter.post("/get_module", async (req, res) => {
  try {
    const { year, name, speciality } = req.body;
    if (!year || !name || !speciality) {
      return res.status(400).json({ msg: "المعلومات غير كاملة" });
    }
    const module = await Subject.findOne({ name, speciality, year });
    if (!module) {
      return res.status(404).json({ msg: "لا يوجد دروس أو امتحانات حاليًا" });
    }
    res.status(200).json(module);
  } catch (error) {
    console.error("Get module error:", error.message);
    res.status(500).json({ error: "خطأ في جلب المادة" });
  }
});

module.exports = moduleRouter;
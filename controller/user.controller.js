const User = require("../models/User");
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { name, email, password, level } = req.body;

    const user = await User.findOne({ email });
    if (!name || !email || !password) {
      throw new Error("이름, 이메일, 비밀번호는 필수 입력 항목입니다.");
    }

    if (user) {
      throw new Error("이미 가입한 유저입니다.");
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash,
      level: level ? level : "customer",
    });
    await newUser.save();
    res.status(200).json({ status: "ok", data: newUser });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = userController;

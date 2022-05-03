var bcrypt = require("bcryptjs");
const sendMail = require("../../utils/mail.hook");
const { v4: uuid } = require("uuid");
const { genarateToken } = require("../../utils/token.utils");
const {
  DOMAIN_MAIL_URL,
  DOMAIN_MAIL_URL_FORGOT,
} = require("../../constants/commom.constant");
const db = require("../../models");

module.exports = () => {
  var userModel = db.users;
  var groupModel = db.groupUsers;
  const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const userId = uuid().substring(0, 15);
      const checkUserExits = await userModel.findOne({
        where: {
          email,
        },
      });
      if (checkUserExits) {
        await userModel.update(
          { email, password: bcrypt.hashSync(password, 8), name, userId },
          {
            where: {
              email,
            },
          }
        );
      } else {
        await userModel.create({
          email,
          password: bcrypt.hashSync(password, 8),
          name,
          userId,
        });
      }
      await sendMail({ email, url: DOMAIN_MAIL_URL(userId) });

      return res.status(200).json({ message: true });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  const resendMail = async (req, res) => {
    const { email, forgot } = req.body;
    const user = await userModel.findOne({ where: { email } });
    console.log(user.userId);
    if (forgot) {
      await sendMail({ email, url: DOMAIN_MAIL_URL_FORGOT(user.userId) });
    } else {
      await sendMail({ email, url: DOMAIN_MAIL_URL(user.userId) });
    }
    return res.json({ message: "Mail is sending" });
  };

  const acceptMail = async (req, res) => {
    const { userId } = req.body;
    try {
      const existUser = await userModel.findOne({
        where: { userId },
      });
      if (!existUser) {
        return res.status(404).json({ message: "User Not Found" });
      }
      await userModel.update(
        { active: true },
        {
          where: {
            userId,
          },
        }
      );
      return res.json({ message: "Sign up successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const checkPass = await bcrypt.compareSync(password, user.password);
    if (!checkPass) {
      return res
        .status(401)
        .json({ access_token: null, message: "Invalid Password " });
    }

    if (!user.active) {
      return res
        .status(401)
        .json({ message: "you check email to active", acceptMail: true });
    }

    var token = genarateToken({ email, id: user.id, userId: user.userId });
    delete user.dataValues.password;
    return res.status(200).json({ access_token: token, user });
  };

  const resetPassword = async (req, res) => {
    const { password, userId, currentPassword = null } = req.body;
    try {
      const checkExistUser = await userModel.findOne({ where: { userId } });
      if (!checkExistUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (currentPassword) {
        const checkPassCurrent = await bcrypt.compareSync(
          currentPassword,
          checkExistUser.password
        );
        if (!checkPassCurrent) throw new Error("Current Password is incorrect");
      }

      await userModel.update(
        { password: bcrypt.hashSync(password, 8) },
        { where: { userId } }
      );
      return res.json({ message: "Successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  return { signup, resendMail, acceptMail, login, resetPassword };
};

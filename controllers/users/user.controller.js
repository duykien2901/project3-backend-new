const { Op } = require("sequelize");
const { DOMAIN_CHANGE_MAIL } = require("../../constants/commom.constant");
const db = require("../../models");
const sendMail = require("../../utils/mail.hook");

module.exports = () => {
  var userModel = db.users;

  const checkUserExist = async (req) => {
    const { id } = req.params;
    const where = {
      [Op.or]: {
        id: +id || 0,
        userId: id || "",
      },
    };

    const user = await userModel.findOne({
      attributes: { exclude: ["password"] },
      where: { ...where },
    });
    if (!user) {
      throw new Error("User Not found");
    }
    return user;
  };

  const getUser = async (req, res) => {
    try {
      const user = await checkUserExist(req);
      return res.json({ user });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "Something went wrong" });
    }
  };

  const changeName = async (req, res) => {
    try {
      await userModel.update(
        {
          name: req.body.name,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const newUser = await checkUserExist(req);
      return res.status(200).json({
        message: "Successfully",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  };

  const changeMail = async (req, res) => {
    const { email, userId } = req.body;
    try {
      const userExistEmail = await userModel.findOne({ where: { email } });
      if (userExistEmail) {
        throw new Error("Email is exist");
      }
      sendMail({
        email,
        url: DOMAIN_CHANGE_MAIL(userId, encodeURIComponent(email)),
      });
      return res.json({ message: "Bạn cần xác nhận email" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  };

  const acceptChangeMail = async (req, res) => {
    const { userId, email } = req.body;
    try {
      await userModel.update({ email }, { where: { userId } });
      const newUser = await userModel.findOne({ where: { userId } });
      return res.status(200).json({
        message: "Successfully",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  };

  const changeProfileImage = async (req, res) => {
    try {
      await userModel.update(
        {
          profileImage: req.body.profileImage,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const newUser = await checkUserExist(req);
      return res.status(200).json({
        message: "Successfully",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  };

  const changeUserProfile = async (req, res) => {
    const { name, email, password, profileImage } = req.body;
    name && changeName(req, res);

    email && changeMail(req, res);

    profileImage && changeProfileImage(req, res);
  };

  const getUserByName = async (req, res) => {
    const { name } = req.query;
    try {
      const listUser = await userModel.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        limit: 5,
        attributes: ["name", "userId", "profileImage"],
      });
      return res.json({ users: listUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  return { getUser, changeUserProfile, acceptChangeMail, getUserByName };
};

const db = require("../../models");

module.exports = () => {
  const { users: UserModel, userFollows: UserFollowModel } = db;

  const checkExistFollow = async (req) => {
    const { followId } = req.body;
    const userId = req.params;
    const userFollows = await UserFollowModel.findOne({
      where: { userId, followId },
    });
    if (userFollows) return true;
    return false;
  };

  const createUserFollow = async (req, res) => {
    const { followId } = req.body;
    const userId = req.params;
    const checkExist = await checkExistFollow(req);

    try {
      if (checkExist) {
        await UserFollowModel.update(
          { deletedAt: null },
          { where: { userId, followId } }
        );
      } else {
        await UserFollowModel.create({ userId, followId });
      }
      return res.json({ message: true });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

  const deleteUserFollows = async (req, res) => {
    const { followId } = req.body;
    const userId = req.params;
    try {
      await UserFollowModel.destroy({ where: { userId, followId } });
      return res.json({ message: true });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

  return { createUserFollow, deleteUserFollows };
};

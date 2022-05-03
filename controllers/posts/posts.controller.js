const channel = require("../../channel");
const { MODE_HIDE_POST } = require("../../constants/commom.constant");
const { LIMIT, OFFSET } = require("../../constants/default.constant");
const db = require("../../models");
const validateResponse = require("../../utils/changeResponse.hook");

module.exports = (app) => {
  const PostModel = db.posts;
  const UserModel = db.users;
  const ReactionModel = db.reactions;
  const { sequelize } = db;

  const checkPostById = async (req) => {
    const { id } = req.params;
    const post = await PostModel.findByPk(+id);

    if (!post) {
      throw new Error("Post is not found");
    }
    return post;
  };

  const checkUserExist = async (id) => {
    const user = await UserModel.findByPk(+id);
    if (!user) {
      throw new Error("User is not found");
    }
    return;
  };

  const subPostQuery = () => {
    return [
      [
        sequelize.literal(`(
                SELECT COUNT(*)
                FROM comments 
                WHERE
                    posts.id = comments.post_id
                    and comments.deletedAt IS NULL
            )`),
        "totalComment",
      ],
      [
        sequelize.literal(`(
                SELECT COUNT(*)
                FROM reactions 
                WHERE
                    posts.id = reactions.post_id
            )`),
        "totalReactions",
      ],
    ];
  };

  const getAllPost = async (req, res) => {
    const { limit = LIMIT, offset = OFFSET, userId } = req.query;
    const { user } = req;

    const conditionUser = userId ? { userId } : {};
    const conditionPost =
      userId !== user.userId ? { modeHide: MODE_HIDE_POST.PUBLIC } : {};

    try {
      let { count: total, rows: posts } = await PostModel.findAndCountAll({
        limit: +limit,
        offset: +offset,
        where: { ...conditionPost },
        include: [
          {
            model: UserModel,
            as: "owner",
            attributes: {
              exclude: ["password", "active", "createdAt", "updatedAt"],
            },
            where: { ...conditionUser },
          },
          {
            model: ReactionModel,
            where: {
              userId: user.id,
            },
            required: false,
            attributes: ["vote"],
          },
        ],
        attributes: {
          include: subPostQuery(),
        },
        order: [["updatedAt", "DESC"]],
      });

      posts = await Promise.all(posts.map((post) => validateResponse(post)));

      return res.json({ total, posts });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  };

  const createPost = async (req, res) => {
    try {
      let post = await PostModel.create({ ...req.body });
      post = await validateResponse(post);
      // post.dataValues.reactions = [];
      post.dataValues.owner = await UserModel.findOne({
        where: {
          id: post.ownerId,
        },
        attributes: {
          exclude: ["password", "active", "createdAt", "updatedAt"],
        },
      });

      return res.json({ post });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  };

  const getPostById = async (req, res) => {
    try {
      let post = await PostModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: UserModel,
            as: "owner",
            attributes: ["name", "email", "id", "profileImage", "userId"],
          },
          {
            model: ReactionModel,
            where: {
              userId: req.user.id,
            },
            required: false,
            attributes: ["vote"],
          },
        ],
        attributes: {
          include: subPostQuery(),
        },
      });
      post = await validateResponse(post);
      return res.json({ post });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };

  const updatePostById = async (req, res) => {
    const postRequest = req.body;
    const { user } = req;
    try {
      await PostModel.update(
        {
          ...postRequest,
        },
        { where: { id: req.params.id } }
      );

      let postResponse = await PostModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: UserModel,
            as: "owner",
            attributes: ["name", "email", "id", "profileImage", "userId"],
          },
          {
            model: ReactionModel,
            where: {
              userId: user.id,
            },
            required: false,
            attributes: ["vote"],
          },
        ],
        attributes: {
          include: subPostQuery(),
        },
      });
      postResponse = await validateResponse(postResponse);
      return res.json({ post: postResponse });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  const deleteById = async (req, res) => {
    try {
      const post = await checkPostById(req);
      // await PostModel.destroy({ where: { id: post.id }, truncate: true });
      await PostModel.destroy({ where: { id: post.id } });

      return res.json({ message: "successfully" });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message });
    }
  };

  const getPostByUser = async (req, res) => {
    const { userId } = req.params;
    const { limit = LIMIT, offset = OFFSET } = req.query;
    try {
      await checkUserExist(userId);
      let posts = await PostModel.findAll({
        where: { ownerId: +userId },
        limit: +limit,
        offset: +offset,
      });
      posts = await Promise.all(posts.map((post) => validateResponse(post)));
      return res.json({ posts });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };

  return {
    createPost,
    getAllPost,
    getPostById,
    updatePostById,
    deleteById,
    getPostByUser,
  };
};

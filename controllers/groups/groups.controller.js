const { ROLE } = require("../../constants/commom.constant");
const db = require("../../models");
const groupSchema = require("./groups.schema");

module.exports = () => {
  const GroupsModel = db.groups;
  const GroupsUsersModel = db.groupUsers;
  const { sequelize } = db;

  const subQuery = () => {
    return [
      [
        sequelize.literal(`(
                SELECT COUNT(*)
                FROM group_users 
                WHERE
                  groups.id = group_users.group_id
            )`),
        "totalMembers",
      ],
    ];
  };

  const createGroup = async (req, res) => {
    const { userId } = req.query;
    console.log(userId);
    console.log(req.body);
    const { error } = groupSchema.validate({ ...req.body });
    if (error) {
      console.log(error);
      throw new Error(error);
    }
    const { name, description, members, permission, accessLevel } = req.body;
    try {
      const group = await GroupsModel.create(
        {
          name,
          description,
          accessLevel,
          permission,
          groupUsers: { userId, role: ROLE.ADMIN },
        },
        {
          include: GroupsUsersModel,
        }
      );
      return res.json({ message: "Successfully", group });
      //return res.json({ message: "Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  const getGroupInfor = async (req, res) => {
    const { id } = req.params;
    try {
      const groups = await GroupsModel.findOne({
        where: { id },
        include: subQuery(),
      });
      return res.json({ groups });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const addUserToGroup = async (req, res) => {};

  return { createGroup, getGroupInfor, addUserToGroup };
};

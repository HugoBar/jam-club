const Group = require("../../models/Group");

// Check if the user is the owner of the group
const isUserOwnerOfGroup = async (userId, groupId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }
  return group.owner === userId;
};

// Check if the user is a member of the group
const isMemberOfGroup = async (userId, groupId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }
  return group.members.includes(userId);
};

module.exports = { isUserOwnerOfGroup, isMemberOfGroup };

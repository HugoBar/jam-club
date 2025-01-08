const Group = require("../models/group.model");
const Recommendation = require("../models/recommendation.model");
const User = require("../models/user.model");
const Invite = require("../models/invite.model");

class GroupController {
  // Static method to handle the creation of a new group
  static async addGroup(req, res) {
    const { name, members } = req.body;

    const group = new Group({ name, members, owner: req.userId });

    await group.save();

    // Respond with a success message and a 201 status code
    res.status(201).json({ message: "Group created successfully" });
  }

  // Static method to handle adding members to an existing group
  static async inviteById(req, res) {
    try {
      const groupId = req.params.id;
      const group = await Group.findById(groupId);

      // Check if the group exists
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Check if the current user is the owner of the group
      if (group.owner != req.userId) {
        return res.status(401).json({ message: "Not group owner" });
      }

      const { invitee } = req.body;

      // Check if the invitee is already in the group
      if (group.members.includes(invitee)) {
        return res.status(400).json({ message: "Member already in group" });
      }

      const invite = new Invite({ inviter: req.userId, invitee, group: groupId});
      await invite.save();

      // Respond with a success message
      return res.status(201).json({
        message: "Invite sent successfully"
      });
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'Invite already exists for this user and group' });
      }
      // Log and handle any errors that occur during the process
      console.error("Error updating group members:", error);
    }
  }

  // Static method to fetch a group by its ID
  static async getGroupById(req, res) {
    try {
      const groupId = req.params.id;

      const group = await Group.findById(groupId);

      // If the group is not found, return a 404 error with an appropriate message
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Fetch today's recommendations for all members of the group
      const recommendations = await Recommendation.findTodayByUsers(
        group.members
      );

      // Attach the recommendations to the group data
      const groupData = group.toObject();
      groupData.recommendations = recommendations;

      // Respond with the group data, including today's recommendations
      res.status(200).json(groupData);
    } catch (error) {
      // Catch and handle any errors during the process and respond with a 500 status
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Server error. Could not fetch group." });
    }
  }
}

module.exports = GroupController;

const Group = require("../models/group.model");
const Recommendation = require("../models/recommendation.model");
const User = require("../models/user.model");
const Invite = require("../models/invite.model");

const {
  isUserOwnerOfGroup,
  isMemberOfGroup,
} = require("../helpers/group/group.helper");

class GroupController {
  // Static method to handle the creation of a new group
  static async addGroup(req, res) {
    const { name, members } = req.body;

    members.push(req.userId);
    
    const group = new Group({ name, members, owner: req.userId });

    await group.save();

    // Respond with a success message and a 201 status code
    res.status(201).json({ message: "Group created successfully", group });
  }

  static async getGroups(req, res) {
    try {
      const groups = await Group.find();

      res.status(200).json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Internal Server Error" });
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
      const recommendations = await Recommendation.findTodayRecommendations(
        groupId
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

  static async deleteGroup(req, res) {
    try {
      const groupId = req.params.id;

      // Check if the current user is the owner of the group
      const isOwner = await isUserOwnerOfGroup(req.userId, groupId);
      if (!isOwner) {
        return res.status(401).json({ message: "Not group owner" });
      }
  
      const group = await Group.findById(groupId)

      const memberIds = group.members;
  
      // Remove the group ID from each member's groups field
      await User.updateMany(
        { _id: { $in: memberIds } }, // Match all users in the members array
        { $pull: { groups: groupId } } // Remove the group ID from their groups array
      );
  
      // Delete the group
      await Group.findByIdAndDelete(groupId);

      res.status(201).json({ message: "Group deleted successfully" });
    } catch {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "Server error. Could not delete group." });
    } 
  }

  // Static method to handle adding members to an existing group
  static async inviteById(req, res) {
    try {
      const groupId = req.params.id;

      // Check if the current user is the owner of the group
      const isOwner = await isUserOwnerOfGroup(req.userId, groupId);
      if (!isOwner) {
        return res.status(401).json({ message: "Not group owner" });
      }

      const { invitee } = req.body;

      // Check if the invitee is already a member of the group
      const isMember = await isMemberOfGroup(invitee, groupId);
      if (isMember) {
        return res.status(400).json({ message: "User is already a member of the group" });
      }

      const invite = new Invite({
        inviter: req.userId,
        invitee,
        group: groupId,
      });
      await invite.save();

      // Respond with a success message
      return res.status(201).json({ message: "Invite sent successfully", invite });
    } catch (error) {
      // Duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({ message: "Invite already exists for this user and group" });
      }
      // Log and handle any errors that occur during the process
      console.error("Error updating group members:", error);
    }
  }

  static async getGroupInvites(req, res) {
    try {
      const groupId = req.params.id;

      const invites = await Invite.find({ group: groupId });

      res.status(200).json(invites);
    } catch (error) {
      console.error("Error fetching group's invites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async rejectGroupInvite(req, res) {
    try {
      const { inviteeId, id: groupId } = req.params;
      const { status } = req.body;

      const invite = await Invite.findOneAndUpdate(
        {
          _id: inviteeId,
          group: groupId,
          status: "pending",
        },
        { status },
        { new: true }
      );

      res.status(200).json({ message: `Invite was ${status}`, invite });
    } catch (error) {
      console.error("Error rejecting the invite:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async acceptGroupInvite(req, res) {
    try {
      const { inviteId, id: groupId } = req.params;

      const invite = await Invite.findOneAndUpdate(
        {
          _id: inviteId,
          group: groupId,
          status: "pending",
        },
        { status: "accepted" }
      );

      if (!invite) {
        return res.status(404).json({ message: "Invite not found" });
      }

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $addToSet: { members: invite.invitee },
        },
        { new: true }
      );

      await User.findByIdAndUpdate(invite.invitee, {
        $addToSet: { groups: groupId },
      });

      res.status(200).json({ message: "User was added to the group", group });
    } catch (error) {
      console.error("Error accepting the invite:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async removeFromGroup(req, res) {
    try {
      const groupId = req.params.id;
      const { user_id: userId } = req.body;

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $pullAll: { members: [userId] },
        },
        { new: true }
      );

      await User.findByIdAndUpdate(
        userId,
        {
          $pullAll: { groups: [groupId] },
        },
        { new: true }
      );

      res.status(200).json({ message: "User removed from group", group });
    } catch (error) {
      console.error("Error removing user from group:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = GroupController;

const Group = require("../models/group.model");
const Recommendation = require("../models/recommendation.model");
const User = require("../models/user.model");
const Invite = require("../models/invite.model");

const {
  isUserOwnerOfGroup,
  isMemberOfGroup,
} = require("../helpers/group/group.helper");

class GroupController {
  // Create a new group
  static async addGroup(req, res) {
    try {
      const { name } = req.body;

      const group = new Group({
        name,
        members: [req.userId],
        owner: req.userId,
      });

      await group.save();

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { groups: group._id } },
        { new: true }
      );

      res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
      // Log any error and send a failure response
      console.error("Error creating group:", error);

      // Duplicate key error
      if (error.code === 11000) {
        return res.status(500).json({ error: "Group name is already taken" });
      }

      res.status(500).json({ error: "Server Error. Could not create group." });
    }
  }

  // Fetch all groups
  static async getGroups(req, res) {
    try {
      const groups = await Group.find();

      res.status(200).json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res
        .status(500)
        .json({ message: "Server Error. Could not fetch groups." });
    }
  }

  //Fetch all groups for a specific user
  static async getUserGroups(req, res) {
    // Fetch groups where the user is a member or owner
    try {
      const user = await User.findById(req.userId).populate("groups");

      res.status(200).json(user.groups);
    } catch (error) {
      console.error("Error fetching user's groups:", error);
      res
        .status(500)
        .json({ message: "Server Error. Could not fetch user's groups." });
    }
  }

  // Fetch a group by its ID
  static async getGroupById(req, res) {
    try {
      const groupId = req.params.id;

      const group = await Group.findById(groupId).populate("members");

      // If the group is not found, return a 404 error with an appropriate message
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Fetch today's recommendations for the group
      const recommendations = await Recommendation.findTodayRecommendations(
        groupId
      );

      // Attach the recommendations to the group data
      const groupData = group.toObject();
      groupData.recommendations = recommendations;

      res.status(200).json(groupData);
    } catch (error) {
      // Catch and handle any errors during the process and respond with a 500 status
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Server error. Could not fetch group." });
    }
  }

  // Delete a group by its ID
  static async deleteGroup(req, res) {
    try {
      const groupId = req.params.id;

      // Check if the current user is the owner of the group
      const isOwner = await isUserOwnerOfGroup(req.userId, groupId);
      if (!isOwner) {
        return res.status(401).json({ message: "Not group owner" });
      }

      const group = await Group.findById(groupId);

      const memberIds = group.members;

      // Remove the group reference from members' records
      await User.updateMany(
        { _id: { $in: memberIds } }, // Match all users in the members array
        { $pull: { groups: groupId } } // Remove the group ID from their groups array
      );

      // Delete the group
      await Group.findByIdAndDelete(groupId);

      res.status(201).json({ message: "Group deleted successfully" });
    } catch {
      console.error("Error deleting group:", error);
      res
        .status(500)
        .json({ message: "Server error. Could not delete group." });
    }
  }

  // Invite user to an existing group
  static async inviteByUsername(req, res) {
    try {
      const groupId = req.params.id;

      // Check if the current user is the owner of the group
      const isOwner = await isUserOwnerOfGroup(req.userId, groupId);
      if (!isOwner) {
        return res.status(401).json({ message: "Not group owner" });
      }

      const { username } = req.body;

      const invitee = await User.findOne({ username: username });

      // Check if the invitee is already a member of the group
      const isMember = await isMemberOfGroup(invitee, groupId);
      if (isMember) {
        return res
          .status(500)
          .json({ message: "User is already a member of the group" });
      }

      // Create the invite
      const invite = new Invite({
        inviter: req.userId,
        invitee,
        group: groupId,
      });
      await invite.save();

      return res
        .status(201)
        .json({ message: "Invite sent successfully", invite });
    } catch (error) {
      // Log and handle any errors that occur during the process
      console.error("Error updating group members:", error);

      // Duplicate key error
      if (error.code === 11000) {
        return res.status(500).json({ message: "User already has an invite" });
      }
      res.status(500).json({ error: "Server Error. Could not invite user." });
    }
  }

  // Fetch all invites for a specific group
  static async getGroupInvites(req, res) {
    try {
      const groupId = req.params.id;

      const invites = await Invite.find({ group: groupId });

      res.status(200).json(invites);
    } catch (error) {
      console.error("Error fetching group's invites:", error);
      res
        .status(500)
        .json({ message: "Server Error. Could not fetch invites." });
    }
  }

  // Reject an invite for a group
  static async rejectGroupInvite(req, res) {
    try {
      const { inviteId, id: groupId } = req.params;
      const { status } = req.body;

      const invite = await Invite.findOneAndUpdate(
        {
          _id: inviteId,
          group: groupId,
          status: "pending",
        },
        { status },
        { new: true }
      );

      if (!invite) {
        return res.status(404).json({ message: "Invite not found" });
      }

      res.status(200).json({ message: `Invite was ${status}`, invite });
    } catch (error) {
      console.error("Error rejecting the invite:", error);
      res
        .status(500)
        .json({ message: "Server Error. Could not reject invite." });
    }
  }

  // Accept an invite to join a group
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
      res
        .status(500)
        .json({ message: "Server Error. Could not accept invite." });
    }
  }

  // Remove a user from a group
  static async removeFromGroup(req, res) {
    try {
      const groupId = req.params.id;
      const { userId: removeUserId } = req.body;
      const userId = req.userId;

      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const isOwner = group.owner.toString() === userId;
      const isRemoveSelf = userId === removeUserId;

      if (!isOwner && !isRemoveSelf) {
        // is not owner and not removing self
        return res.status(401).json({ message: "Not group owner" });
      } else if (isOwner && isRemoveSelf) {
        // is owner and removing self aka owner leaving group -> groups is disbanded
        await Group.findOneAndDelete({ _id: groupId });

        return res.status(200).json({ message: "Group deleted with success" });
      } else {
        // is owner and removing another user or is not owner and removing self
        group.members.pull(removeUserId);
        await group.save();

        await User.findByIdAndUpdate(
          removeUserId,
          { $pull: { groups: groupId } },
          { new: true }
        );
      }

      res.status(200).json({ message: "User removed from group", group });
    } catch (error) {
      console.error("Error removing user from group:", error);
      res
        .status(500)
        .json({ message: "Server Error. Could not remove user from group." });
    }
  }
}

module.exports = GroupController;

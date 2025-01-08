const Group = require("../models/group.model");
const Recommendation = require("../models/recommendation.model");
const User = require("../models/user.model");

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
  static async addMembers(req, res) {
    try {
      const groupId = req.params.id;
      const { newMembers } = req.body;

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $addToSet: { members: { $each: newMembers } }, // Add new members, avoiding duplicates
        },
        { new: true } // Return the updated document
      );

      // If no group was found, log the error and return without further action
      if (!updatedGroup) {
        console.log("Group not found");
        return;
      }

    // Iterate over each new member and update the user's groups
    for (const memberId of newMembers) {
      console.log(memberId);
      const user = await User.findByIdAndUpdate(
        memberId,
        { $addToSet: { groups: { $each: [groupId] } } },
        { new: true }
      );

      console.log(user);
      if (!user) {
        console.log("User not found");
        return;
      }
    }

      // Respond with a success message
      res
        .status(201)
        .json({ message: "Members added successfully", updatedGroup });
    } catch (error) {
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

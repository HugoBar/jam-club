const Group = require("../models/group.model");
const Recommendation = require("../models/recommendation.model");

class GroupController {
  static async addGroup(req, res) {
    // Creating a new instance of the Group model with the body params
    const { name, members } = req.body;
    const group = new Group({ name, members });

    // Saving the group to the database
    await group.save();

    // Sending a success response with a status code of 201 and a success message
    res.status(201).json({ message: "Group created successfully" });
  }

  static async addMembers(req, res) {
    try {
      const groupId = req.params.id;
      const { newMembers } = req.body;

      // Find the group by ID and update its members
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $addToSet: { members: { $each: newMembers } }, // Add new members, avoiding duplicates
        },
        { new: true } // Return the updated document
      );

      if (!updatedGroup) {
        console.log("Group not found");
        return;
      }

      res.status(201).json({ message: "Members added successfully", updatedGroup });
    } catch (error) {
      console.error("Error updating group members:", error);
    }
  }

  // This method handles the request to get a group by its ID, along with recommendations for today.
  static async getGroupById(req, res) {
    try {
      const groupId = req.params.id;
      const group = await Group.findById(groupId);

      // If no group is found, return a 404 error with a message
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Fetch today's recommendations for all members of the group
      const recommendations = await Recommendation.findTodayByUsers(
        group.members
      );

      // Convert the group document (from Mongoose) to a plain JavaScript object
      const groupData = group.toObject();

      // Ensure the recommendations are included in the final response
      groupData.recommendations = recommendations;

      // Respond with the group data, including the recommendations for today
      res.status(200).json(groupData);
    } catch (error) {
      // Catch any errors that occur during the process and return a 500 error
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Server error. Could not fetch group." });
    }
  }
}

module.exports = GroupController;

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // The user who receives the notification (post owner)
  },
  type: {
    type: String,
    enum: ["like", "comment"],
    required: true, // Type of notification
  },
  postId: {
    type: String,
    required: true, // The post that was interacted with
  },
  actorId: {
    type: String,
    required: true, // The user who performed the action (liker/commenter)
  },
  actorName: {
    type: String,
    required: true, // Name of the user who performed the action
  },
  message: {
    type: String,
    required: true, // Notification message (e.g., "User liked your post")
  },
  read: {
    type: Boolean,
    default: false, // Whether the notification has been read
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
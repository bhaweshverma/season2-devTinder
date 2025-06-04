const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// from and to can't be same -this can be handled here or at DB level using pre hooks. Handled in Schema
connectionRequestSchema.pre("save", function (next) {
  const { fromUserId, toUserId } = this;
  if (fromUserId.toString() === toUserId.toString()) {
    throw new Error("can't send request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;

const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const router = express.Router();

router.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, userId } = req.params;

    // status can be only interested or ignored not anything else like hello/xyz
    const VALID_STATUS_SEND_REQUEST = ["interested", "ignored"];
    if (!VALID_STATUS_SEND_REQUEST.includes(status)) {
      throw new Error("invalid status value");
    }

    // to should be valid mongo userId not random string - handled at DB level automatically
    // to should be present in the current mongodb
    const isToUserValid = await User.findOne({ _id: userId });
    if (!isToUserValid) {
      throw new Error("request sent to is not valid user");
    }

    // can't send from to duplicate requests
    const isValidConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: userId },
        { fromUserId: userId, toUserId: loggedInUser._id },
      ],
    });

    if (isValidConnectionRequest) {
      throw new Error("duplicate request exists already");
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId: loggedInUser._id,
      toUserId: userId,
      status,
    });

    const resultConnectionRequest = await newConnectionRequest.save();

    res.json({
      message: "connection request interested or ignored",
      data: resultConnectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // status can be only accepted or rejected not anything else like hello/xyz
      const VALID_STATUS_REVIEW_REQUEST = ["accepted", "rejected"];
      if (!VALID_STATUS_REVIEW_REQUEST.includes(status)) {
        throw new Error("invalid status value");
      }

      // is there any valid request to Logged-in User
      const isValidConnectRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!isValidConnectRequest) {
        throw new Error("connection request not found");
      }

      isValidConnectRequest.status = status;

      const data = await isValidConnectRequest.save();

      res.json({
        message: "Connection Request " + status,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = router;

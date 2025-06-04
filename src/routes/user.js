const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age gender photoUrl about";

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // ["firstName", "lastName", "age", "gender"] or
    // "firstName lastName age gender"
    const connectionRequestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    // if (connectionRequestsReceived.length === 0) {
    //   throw new Error("no pending requests");
    // }

    res.json({
      message: "connections found successfully",
      data: connectionRequestsReceived,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const anyConnectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!anyConnectionRequest) {
      throw new Error("no connections available");
    }

    const data = anyConnectionRequest.map((obj) => {
      if (obj.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return obj.toUserId;
      }
      return obj.fromUserId;
    });

    res.json({
      message: "connections found successfully",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    if (limit > 50) limit = 50;
    const skip = (page - 1) * limit;

    // all the active users who are nearby and are not "ignored" or "interested" by loggedinuser
    // all the active users who have not "accepted" or "rejected" request of loggedinuser
    // loggedinuser should not see his/her own profile in the feed
    // all users who have not ignored me yet
    // filter on my preferences like distance, skillset, etc,
    // user should see all the profiles except
    // 0. own
    // 1. his connections
    // 2. ignored connections
    // 3. already has/had sent the connection request

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((obj) => {
      hideUsersFromFeed.add(obj.fromUserId.toString());
      hideUsersFromFeed.add(obj.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "connections found successfully",
      data: feedUsers,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = router;

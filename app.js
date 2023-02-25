const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

const {
  receiveNewUsers,
  receiveNewComments,
  receiveNewLocations,
  getComments,
  getSpecificLocation,
  getUser,
  getUserList,
  addToBucketList,
  deleteUser,
  deleteComment,
  deleteLocation,
  deleteUserList,
  commentVote,
  getProfilePicture,
  getLocations,
} = require("./controller");

app.get("/api/locations", getLocations);
app.get("/api/:locations/comments", getComments);
app.get("/api/:locations", getSpecificLocation);
app.get("/api/users/:user", getUser);
app.get("/api/users/:user/list", getUserList);
app.post("/api/users", receiveNewUsers);
app.post("/api/locations", receiveNewLocations);
app.post("/api/comments", receiveNewComments);
app.patch("/api/:user/list", addToBucketList);
app.patch("/api/:commentId/votes/:user", commentVote);
app.patch("/api/:user/:profilepicture", getProfilePicture);
app.delete("/api/users/:user/", deleteUser);
app.delete("/api/comments/:comment", deleteComment);
app.delete("/api/locations/:location", deleteLocation);
app.delete("/api/:user/list/:locationId", deleteUserList);

module.exports = { app };

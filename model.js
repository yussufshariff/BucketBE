const mongoose = require("mongoose");
const assert = require("assert");
const { userInfo } = require("os");
const { url } = require("./url");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Bookit_Bucket",
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: " + error);
  });

const locationsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coordinates: { type: String, required: true },
  },

  { versionKey: false }
);

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile_picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    bucket_list: { type: Array, required: true },
  },

  { versionKey: false }
);

const commentsSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    userId: { type: String, required: true },
    locationId: { type: String, required: true },
    body: { type: String, required: true },
    images: { type: Array, required: true },
    hasVoted: { type: Array, required: true },
  },

  { versionKey: false }
);

const users = mongoose.model("users", usersSchema);
const locations = mongoose.model("locations", locationsSchema);
const comments = mongoose.model("comments", commentsSchema);

exports.newLocations = async (input) => {
  const location = new locations(input);
  if (input.name !== "undefined" && input.coordinates !== "undefined") {
    return locations.find().then(async function (locations) {
      let exists = false;
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === location.name) {
          exists = true;
        }
      }
      if (!exists) {
        location.save((error, location) => {
          if (error) {
            console.error(error);
          } else {
            console.log(location);
            return location;
          }
        });
      }
    });
  } else return Promise.reject({ status: 400, msg: "invalid body" });
};

exports.newUsers = async (input) => {
  console.log(input);
  const user = new users(input);
  if (
    input.name == "undefined" ||
    input.email == "undefined" ||
    input.password == "undefined"
  ) {
    return "Invalid data given";
  }
  return users.find().then(async function (users) {
    let exists = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].name === user.name) {
        exists = true;
      }
    }
    if (!exists) {
      user.profile_picture =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
      return user.save((error, user) => {
        if (error) {
          console.error(error);
        }
      });
    } else {
      return "User already exists";
    }
  });
};

exports.newComments = async (input) => {
  const user = await users.findOne({ _id: input.userId });
  const comment = new comments(input);
  comment.owner = user.name;
  return comment.save((error, comment) => {
    if (error) {
      console.error(error);
    } else {
      return comment;
    }
  });
};

exports.fetchLocations = () => {
  return locations
    .find()
    .clone()
    .catch(function (err) {
      console.log(err);
    });
};

exports.fetchComments = async (location) => {
  return await locations
    .findOne({ name: location })
    .then(function (locationFound) {
      let locationId = locationFound.id;
      try {
        return comments
          .find({ locationId: locationId }, (error, comments) => {})
          .clone();
      } catch (err) {}
    });
};

exports.fetchSpecificLocation = async (location) => {
  return locations
    .find({ name: `${location}` }, function (err, specficLocation) {
      if (err) {
        return "Location not found";
      } else {
        return specficLocation;
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
};

exports.fetchSpecificUser = async (user) => {
  return await users
    .findOne({ name: user }, function (err, user) {
      if (user === null) {
        return "User not found";
      } else {
        return user;
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
};

exports.fetchSpecificUserList = async (user) => {
  return await users.findOne({ name: user }).then(function (userFound) {
    let userList = userFound.bucket_list;
    try {
      if (userList.length > 0) {
        return userList;
      } else {
        return "There is currently nothing in your bucket list";
      }
    } catch (err) {}
  });
};

exports.addALocationToBucketList = async (user, locationToAdd) => {
  console.log(locationToAdd, "<--- Location to add");
  return await users.findOne({ name: user }).then(function (userFound) {
    const specificUserFound = userFound;
    try {
      return locations
        .findOne({ name: locationToAdd.name })
        .then(async function (locationFound) {
          if (locationFound !== null) {
            const location = locationFound;
            try {
              let exists = false;
              for (let i = 0; i < specificUserFound.bucket_list.length; i++) {
                if (specificUserFound.bucket_list[i].name === location.name) {
                  exists = true;
                }
              }
              if (!exists) {
                await users.findOneAndUpdate(
                  { name: specificUserFound.name },
                  { $push: { bucket_list: location } },
                  {
                    new: true,
                  }
                );
                return location;
              } else return "location is already in the bucket list";
            } catch (err) {
              return err;
            }
          } else {
            return "location not found, why not create it yourself and be the first to comment?";
          }
        });
    } catch (err) {
      return err;
    }
  });
};

exports.deleteSpecificUser = async (user) => {
  return await users
    .deleteOne({ name: user })
    .then(function () {
      return "User deleted";
    })
    .catch(function (error) {
      return "User not found";
    });
};

exports.deleteSpecificComment = async (comment) => {
  console.log(comment);
  return await comments.findOneAndDelete({ _id: comment });
};

exports.deleteSpecificLocation = async (location) => {
  return await locations.findOneAndDelete({ name: location });
};

exports.deleteSpecificLocationFromList = async (user, location) => {
  return await users.findOne({ name: user }).then(async function (userFound) {
    if (userFound === null) {
      return "user not found";
    } else {
      let newList = [...userFound.bucket_list];
      console.log(newList);
      console.log(location);
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].name === location) {
          newList.splice(i, 1);
          console.log(newList);
        }
      }
      return await users.findOneAndUpdate(
        { name: user },
        { bucket_list: newList }
      );
    }
  });
};

exports.updateCommentVotes = async (commentId, user) => {
  return await comments
    .findOne({ _id: commentId })
    .then(async function (commentFound) {
      if (commentFound.hasVoted.includes(user)) {
        return await comments.findOneAndUpdate(
          { _id: commentId },
          { $pull: { hasVoted: user } }
        );
      } else {
        return await comments.findOneAndUpdate(
          { _id: commentId },
          { $push: { hasVoted: user } }
        );
      }
    });
};

exports.updateProfilePicture = async (user, profilepicture) => {
  return users.findOneAndUpdate(
    { name: user },
    { profile_picture: profilepicture }
  );
};

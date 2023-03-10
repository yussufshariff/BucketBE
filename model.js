const mongoose = require('mongoose');
const { isNullOrUndefined, isNull } = require('util');

require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_MAIN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Bookit_Bucket',
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ' + error);
  });

const locationsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coordinates: { type: Array, required: true },
    hasVisited: { type: Boolean, default: false },
  },

  { versionKey: false }
);

const usersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile_picture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
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

const users = mongoose.model('users', usersSchema);
const locations = mongoose.model('locations', locationsSchema);
const comments = mongoose.model('comments', commentsSchema);

exports.newLocations = async (input) => {
  const location = new locations(input);
  if (input.name !== 'undefined' && input.coordinates !== 'undefined') {
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
  } else return Promise.reject({ status: 400, msg: 'invalid body' });
};

exports.newUsers = async (input) => {
  const user = new users(input);
  if (
    input.username == 'undefined' ||
    !input.username ||
    input.username == undefined ||
    input.email == 'undefined' ||
    !input.email ||
    input.email == undefined ||
    input.password == 'undefined' ||
    !input.password ||
    input.password == undefined
  ) {
    return 'Invalid data given';
  }
  let exists = false;
  let newUser = null;
  try {
    await users.find({ username: input.username }).then(async (users) => {
      if (users.length > 0) {
        exists = true;
      }
      if (exists === false) {
        user.profile_picture =
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
      }
    });
  } catch {}
  if (exists === false) {
    try {
      newUser = await user.save();
    } catch {}
  }
  if (newUser === null) {
    return 'This user already exists';
  } else {
    return newUser;
  }
};

exports.newComments = async (input) => {
  const user = await users.findOne({ _id: input.userId });
  const comment = new comments(input);
  comment.owner = user.username;
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
  return await locations.findOne({ name: location }).then(function () {
    let locationId = location;
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
        return 'Location not found';
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
    .findOne({ username: user }, function (err, user) {
      if (user === null) {
        return 'User not found';
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
  return await users.findOne({ username: user }).then(function (userFound) {
    let userList = userFound.bucket_list;
    try {
      if (userList.length > 0) {
        return userList;
      } else {
        return 'There is currently nothing in your bucket list';
      }
    } catch (err) {}
  });
};

exports.addALocationToBucketList = async (user, locationToAdd) => {
  return await users.findOne({ username: user }).then(function (userFound) {
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
                  { username: specificUserFound.username },
                  { $push: { bucket_list: location } },
                  {
                    new: true,
                  }
                );
                return location;
              } else return 'location is already in the bucket list';
            } catch (err) {
              return err;
            }
          } else {
            return 'location not found, why not create it yourself and be the first to comment?';
          }
        });
    } catch (err) {
      return err;
    }
  });
};

exports.deleteSpecificUser = async (user) => {
  return await users
    .deleteOne({ username: user })
    .then(function () {
      return 'User deleted';
    })
    .catch(function (error) {
      return 'User not found';
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
  return await users
    .findOne({ username: user })
    .then(async function (userFound) {
      if (userFound === null) {
        return 'user not found';
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
          { username: user },
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
    { username: user },
    { profile_picture: profilepicture }
  );
};

exports.updateHasVisited = async (user, location) => {
  const testFunction = async function () {
    let userFound = null;
    try {
      userFound = await users.findOne({ username: user });
    } catch {}

    return userFound;
  };
  testFunction().then(async (userFound) => {
    for (let i = 0; i < userFound.bucket_list.length; i++) {
      console.log(userFound.bucket_list.length);
      if (userFound.bucket_list[i].name === location) {
        if (userFound.bucket_list[i].hasVisited == true) {
          userFound.bucket_list[i].hasVisited = false;
        } else {
          userFound.bucket_list[i].hasVisited = true;
        }
      }
    }
    let updatedUser = null;
    try {
      updatedUser = await users.findOneAndUpdate(
        { username: user },
        { bucket_list: userFound.bucket_list }
      );
    } catch {}
    return updatedUser;
  });
};

const {
  newLocations,
  newUsers,
  newComments,
  fetchComments,
  fetchLocations,
  fetchSpecificLocation,
  fetchSpecificUser,
  fetchSpecificUserList,
  addALocationToBucketList,
  deleteSpecificUser,
  deleteSpecificComment,
  deleteSpecificLocation,
  deleteSpecificLocationFromList,
  updateCommentVotes,
  updateProfilePicture,
} = require("./model.js");

exports.receiveNewLocations = (req, res, next) => {
  const locationDetails = {
    name: `${req.body.name}`,
    coordinates: `${req.body.coordinates}`,
  };
  newLocations(locationDetails)
    .then((newLocations) => {
      res.status(201).send(newLocations);
    })
    .catch(next);
};

exports.receiveNewUsers = (req, res, next) => {
  const userDetails = {
    name: `${req.body.name}`,
    email: `${req.body.email}`,
    password: `${req.body.password}`,
    profile_picture: `${req.body.profilePicture}`,
    bucket_list: [],
  };
  newUsers(userDetails)
    .then((newUser) => {
      console.log(newUser);
      res.status(201).send({ newUser: newUser });
    })
    .catch(next);
};

exports.receiveNewComments = (req, res, next) => {
  const commentDetails = {
    locationId: `${req.body.locationId}`,
    userId: `${req.body.userId}`,
    body: `${req.body.body}`,
    images: `${req.body.images}`,
  };
  newComments(commentDetails)
    .then((newComment) => {
      res.status(201).send({ newComment: newComment });
    })
    .catch(next);
};

exports.getLocations = (req, res, next) => {
  fetchLocations()
    .then((locations) => {
      res.status(200).send({ locations: locations });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { locations } = req.params;
  fetchComments(locations)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.getSpecificLocation = (req, res, next) => {
  const { locations } = req.params;
  fetchSpecificLocation(locations).then((location) => {
    res.status(200).send({ location: location });
  });
};

exports.getUser = (req, res, next) => {
  const { user } = req.params;
  fetchSpecificUser(user).then((userData) => {
    res.status(200).send({ userData: userData });
  });
};

exports.getUserList = (req, res, next) => {
  const { user } = req.params;
  fetchSpecificUserList(user).then((userList) => {
    res.status(200).send({ userList: userList });
  });
};

exports.addToBucketList = (req, res, next) => {
  const { user } = req.params;
  const locationToAdd = req.body;
  addALocationToBucketList(user, locationToAdd).then((updatedList) => {
    console.log(updatedList);
    res.status(201).send({ updatedList: updatedList });
  });
};

exports.deleteUser = (req, res) => {
  const { user } = req.params;
  deleteSpecificUser(user).then((deletedUser) => {
    res.status(204).send({ deletedUser: deletedUser });
  });
};

exports.deleteComment = (req, res) => {
  const { comment } = req.params;
  deleteSpecificComment(comment).then((deletedComment) => {
    res.status(204).send({ deletedComment: deletedComment });
  });
};

exports.deleteLocation = (req, res) => {
  const { location } = req.params;
  deleteSpecificLocation(location).then((deletedLocation) => {
    res.status(204).send({ deletedLocation: deletedLocation });
  });
};

exports.deleteUserList = (req, res) => {
  const { user } = req.params;
  const { locationId } = req.params;
  deleteSpecificLocationFromList(user, locationId).then((deletedLocation) => {
    console.log(deletedLocation);
    res.status(204).send({ deletedLocation: deletedLocation });
  });
};

exports.commentVote = (req, res) => {
  const { user } = req.params;
  const { commentId } = req.params;
  updateCommentVotes(commentId, user).then((updatedComment) => {
    res.status(201).send(updatedComment);
  });
};

exports.getProfilePicture = (req, res) => {
  const { user } = req.params;
  const { profilepicture } = req.params;
  updateProfilePicture(user, profilepicture).then((updatedProfile) => {
    res.status(201).send(updatedProfile);
  });
};

const CustomError = require("../errors");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const authenticateHandler = async (req, res, next) => {
  console.time("authenticate handler");
  let token = req.signedCookies["user"] || req.cookies.user;

  // If the request is coming from the serversideprops, token needs to be retrieved from headers

  if (!token) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }
  let decodedToken;
  let user;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SIGN);
    const { email } = decodedToken;
    user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("You are not authenticated.");
    }
  } catch (err) {
    throw new CustomError.UnauthenticatedError("You are not authenticated.");
  }

  req.user = {
    ...decodedToken,
    userID: user._id.toString(),
    role: user.role,
    avatar: user.avatar,
    portfolio: user.portfolio,
    following: user.following,
    followers: user.followers,
    description: user.description,
    shortDescription: user.shortDescription,
  };
  console.timeEnd("authenticate handler");

  next();
};

module.exports = authenticateHandler;

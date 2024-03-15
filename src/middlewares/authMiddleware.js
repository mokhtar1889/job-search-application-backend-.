import jwt from "jsonwebtoken";
import { Token } from "../../database/models/tokenModel.js";
import { User } from "../../database/models/userModel.js";

export let isAuthenticated = async (req, res, next) => {
  let { token } = req.headers;

  //check token
  if (!token) return next(new Error("token is missing", { cause: 404 }));

  //check barear key
  if (!token.startsWith(process.env.BAREAR_KEY))
    return next(new Error("invalid token"), { cause: 400 });

  //get token
  token = token.split(process.env.BAREAR_KEY)[1];

  //check token in database
  let tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("token is expired", { cause: 404 }));

  //get token payload
  let { id, email } = jwt.verify(token, process.env.TOKEN_SECRET);

  //check user
  let user = await User.findById(id);
  if (!user) return next(new Error("user is not exists", { cause: 404 }));

  //pass user to req
  req.user = user;

  return next();
};

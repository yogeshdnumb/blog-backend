require('dotenv').config()
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.register_get = asyncHandler(async function (req, res, next) {
  res.json({ '1': '1' });
});
exports.register_post = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username should not be empty")
    .isAlphanumeric()
    .withMessage("username cannot contain symbols/space")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password should not be empty")
    .isAlphanumeric()
    .withMessage("password cannot contain symbols/space")
    .escape(),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ errors: errors.array(), msg: "Errors in form" });
    } else {
      const foundUser = await userModel.findOne({
        username: req.body.username,
      });
      if (foundUser) {
        res.status(409).json({ msg: "User already exists" });
      } else {
        const foundUser = new userModel();
        bcrypt.hash(req.body.password, 10, async (err, hashPassword) => {
          if (err) {
            next(err);
          } else {
            console.log(hashPassword);
            foundUser.username = req.body.username;
            foundUser.password = hashPassword;
            foundUser.roles = ["user"]
            await foundUser.save();

            res.status(201).json({ msg: "User Created" });
          }
        });
      }
    }
  }),
];

exports.login_get = asyncHandler(async function (req, res, next) {
  res.render("login");
});

exports.login_post = [
  // function (req, res) {
  //   console.log(req);
  // },
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username should not be empty").escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password should not be empty").escape(),

  asyncHandler(async function (req, res, next) {
    // console.log(req.body);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ errors: errors.array(), message: "Errors in form" });
    }
    else {
      const foundUser = await userModel.findOne({ username: req.body.username })
      if (foundUser) {

        const match = await bcrypt.compare(req.body.password, foundUser.password)
        if (match) {
          const accessToken = jwt.sign({ userInfo: { username: foundUser.username, roles: foundUser.roles } }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_EXPIRY })
          const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRY })

          foundUser.refreshToken = refreshToken
          await foundUser.save()

          res.cookie('rt', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }).status(200).json({ msg: "Pass match", username: foundUser.username, roles: foundUser.roles, accessToken })


        } else {
          res.status(401).json({ msg: "Pass not match" })
        }
      } else {

        res.status(401).json({ msg: "User not found" })
      }
    }

  }),

];

exports.refresh_get = asyncHandler(async function (req, res, next) {
  const refreshToken = req.cookies.rt
  if (!refreshToken) {
    return res.status(401).json({ msg: "no rt" })
  }


  const foundUser = await userModel.findOne({ refreshToken: refreshToken })
  if (!foundUser) {
    return res.send(403).json({ msg: "no rt in users" })
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "err in rt verify", err })
    }
    else if (foundUser.username != decoded.username) {
      return res.status(403).json({ msg: "found usename!=decoded name" })
    }
    else {
      const accessToken = jwt.sign({ userInfo: { username: foundUser.username, roles: foundUser.roles } }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_EXPIRY })
      return res.status(203).json({ msg: 'access token refreshed', accessToken, roles: foundUser.roles })
    }
  })

})

exports.logout_get = asyncHandler(async function (req, res, next) {
  const refreshToken = req.cookies.rt
  if (!refreshToken) {
    return res.status(401).json({ msg: "no rt" })
  }

  // if rt not in db?
  const foundUser = await userModel.findOne({ refreshToken: refreshToken })
  res.clearCookie("rt", { httpOnly: true })
  if (!foundUser) {
    return res.send(204).json({ msg: "no rt in users" })
  }

  // if rt in db
  foundUser.refreshToken = ""
  await foundUser.save()

  res.send(204).json({ msg: "logged out" })


})
require('dotenv').config()
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')



exports.isAuthenticated = asyncHandler(async function (req, res, next) {
  const authHeaders = req.headers["authorization"]
  if (!authHeaders) {
    return res.status(401).json({ msg: "no auth headers!!" })
  }
  const token = authHeaders.split(" ")[1]
  // console.log(token);


  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "error in jwt verify", err })
    }
    // console.log(decoded);
    req.user = decoded.userInfo.username
    req.roles = decoded.userInfo.roles
    next()

  })
  // next()/

})

exports.isAuthorized = function (...allowedRoles) {
  return asyncHandler(async function (req, res, next) {
    // console.log(allowedRoles);
    // for (const role of req.roles) {
    //   if (allowedRoles.includes(role)) {
    //     return next()
    //   }
    // }
    if (allowedRoles.every(role => req.roles.includes(role))) return next()
    res.status(401).json({ msg: "not having roles" })
  })
}
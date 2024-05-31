const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// Middleware to authenticate user
exports.userAuth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// Middleware to authenticate admin
exports.adminAuth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.admin_id);
    if (!admin || admin.role !== 'admin') throw new Error();

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// Middleware to authenticate super admin
exports.superAdminAuth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.admin_id);
    if (!admin || admin.role !== 'superadmin') throw new Error();

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// Middleware to authenticate university admin
exports.universityAuth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.admin_id);
    if (!admin || admin.role !== 'universityadmin') throw new Error();

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
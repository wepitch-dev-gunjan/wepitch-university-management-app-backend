const express = require("express");
const {
  getAdmin,
  getAdmins,
  registerAdmin,
  editAdmin,
  deleteAdmin,
  login,
} = require("../controllers/adminController");
const { adminAuth, superAdminAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all admins (super admin only)
router.get("/admins", superAdminAuth, getAdmins);

// Route to get the profile of the authenticated admin
router.get("/admin/profile", adminAuth, getAdmin);

// Route to register a new admin (super admin only)
router.post("/admin/register", superAdminAuth, registerAdmin);

// Route for admin login
router.post("/admin/login", login);

// Route to edit the profile of the authenticated admin
router.put("/admin/profile", adminAuth, editAdmin);

// Route to delete an admin (super admin only)
router.delete("/admin/:id", superAdminAuth, deleteAdmin);

module.exports = router;

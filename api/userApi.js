const express = require("express");
const {
  getLoggedUserData,
  updateLoggedUserData,
  updateLoggedUserPassword,
  deleteLoggedUserData,
  getUsers,
  addUser,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const { protect, allowedTo } = require("../services/authService");

const { applySlug } = require("../middlewares/apply_slug");

const {
  createUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  updateUserValidator,
  updatePasswordValidator,
  updateAccountValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

// USER ROUTES
router.use(protect);

router.get("/account", getLoggedUserData);
router.put(
  "/updateAccount",
  uploadUserImage,
  resizeImage,
  updateAccountValidator,
  updateLoggedUserData
);
router.put(
  "/changePassword",
  updatePasswordValidator,
  updateLoggedUserPassword
);
router.delete("deleteAccount", deleteLoggedUserData);

// ADMIN ROUTES
router.use(allowedTo("admin", "manager"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, applySlug, addUser);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/:id")
  .get(uploadUserImage, resizeImage, getUserValidator, getUser)
  .put(
    getUserValidator,
    updateUserValidator,
    uploadUserImage,
    resizeImage,
    applySlug,
    updateUser
  )
  .delete(getUserValidator, deleteUser);

module.exports = router;

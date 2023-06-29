const express = require("express");

const router = express.Router();

const {
  getAddresses,
  addAddress,
  removeAddress,
} = require("../services/addressService");

const { protect, allowedTo } = require("../services/authService");
const {
  addAddressdValidator,
} = require("../utils/validators/addressValidator");
router.use(protect, allowedTo("user"));

router.route("/").get(getAddresses).post(addAddressdValidator, addAddress);
router.delete("/:addressId", removeAddress);

module.exports = router;

import express from "express";
import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;

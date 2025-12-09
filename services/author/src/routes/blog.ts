import express from "express";
import { isAuth } from "../middleware/isAuth";
import uploadFile from "../middleware/multer";
import { createBlog, updateBlog } from "../controllers/blog";

const router = express.Router()

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.post("/blog/:id", isAuth, uploadFile, updateBlog);




export default router;
import express from "express";
import { getPosts, addPost, deletePosts } from "../controllers/post.js";

const router = express.Router()

 router.get("/", getPosts)
 router.post("/", addPost)
 router.delete("/:id", deletePosts)


export default router
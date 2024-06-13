import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  // Getting our userId for that session from the cookies which as userId stored
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // The userInfo returns the object which is seen in the auth.js page where you store it in
  // the cookie
  jwt.verify(token, "secretkey", (err, userInfo) => {
    console.log(userInfo.id); 

    if (err) return res.status(403).json("Token is not valid");

    // To get both the user(userId) and all the posts which are from to different tables with conditions
    const q = userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON u.id = p.userId WHERE p.userId = ? ORDER BY p.createdAt DESC` 
      : `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON u.id = p.userId LEFT JOIN
        relationships AS r ON p.userId = r.followedUserId WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC`;

    // const q = `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)`

    db.query(q, [userId !== "undefined" ? userId : userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  // Check if logged in same as above
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // Add post to db
    const q = "INSERT INTO posts(`desc`, `img`, `userId`) VALUES (?, ?, ?)";

    const values = [
      req.body.desc,
      req.body.img,
      // moment(Date.now()).format("YYYY-MMMM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been added!");
    });
  });
};


export const deletePosts = (req, res) => {
    // Check if logged in same as above
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid");
  

      const q = "DELETE FROM posts WHERE `id` =? AND `userId` = ?";
  
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows>0) return res.status(200).json("Post has been deleted!");
        return res.status(403).json("You can delete only your post")
      });
    });
  };
import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from 'jsonwebtoken';

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, u.name, u.profilePic FROM comments AS c JOIN users AS u ON u.id = c.userId 
    WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO comments(`desc`, `userId`, `postId`, `createdAt`) VALUES (?, ?, ?, ?)";

    const values = [
      req.body.desc,
      userInfo.id,
      req.body.postId,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been added!");
    });
  });
};

export const getCommentsCount = (req, res) => {
  const q = `SELECT COUNT(*) as count FROM comments WHERE postId = ?`;

  db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0].count);
  });
};
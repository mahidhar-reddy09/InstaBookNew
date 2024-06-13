import { db } from "../connect.js";
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");
        const { password, ...info } = data[0];
        return res.json(info);
    });
};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");

        const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";
        const values = [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePic, 
            req.body.coverPic,
            userInfo.id
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows === 0) return res.status(404).json("User not found or no changes made");
            return res.status(200).json("User updated successfully");
        });
    });
};

export const getSuggestions = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid");
  
      console.log("User info from token:", userInfo);
  
      const q = `
      SELECT u.id, u.username, u.profilePic, u.name 
      FROM users u
      WHERE u.id != ? AND u.id NOT IN (
        SELECT r.followedUserId FROM relationships r WHERE r.followerUserId = ?
      )
    `;

    const params = [userInfo.id, userInfo.id];
  
      db.query(q, params, (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json(err);
        }
        if (!data || data.length === 0) {
          console.log("No suggestions found.");
          return res.status(200).json([]);
        }
        console.log("Suggestions data:", data);
        return res.status(200).json(data);
      });
    });
  };


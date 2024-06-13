import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


export const register = (req,res) => {

    // Checking if user exists in DB

    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q,[req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exists!")

         // If not Create a new User and Hash password using bcrypt
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users(`username`, `email`, `password`, `name`) VALUE (?)"
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]

        db.query(q,[values], (err,data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("User has been created!")
        })
    })
   
}


export const login = (req,res) => {

    // Now time to check user and see if they exists and have the right password
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q, [req.body.username], (err,data) => {
        if(err) return res.status(500).json(err)
        if(data.length === 0) return res.status(404).json("Incorrect Username try again!")

        // Using bycrypt compare to check password from the form or req body with the hashed password
        // from database.
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

        if(!checkPassword) return res.status(400).json("Incorrect Password try again!")

        // JWT auth for user.id where the user.id can be accessed eg in post.js
        const token = jwt.sign({id: data[0].id}, "secretkey");

        const {password, ...other} = data[0]
        
        console.log(data[0].id)

        // Using cookie is much easier as when we store our accesstoken here we can decrypt it later on and 
        // use it whenever we want to get access to our User Id.
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other)
    })
}

export const logout = (req, res) => {
    // Clear cookie and is better for both dev and production env
    res.clearCookie("accessToken", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        httpOnly: true,
    }).status(200).json("Successfully Logged Out!");
};


  

export const currentUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "secretkey", (err, user) => {
      if (err) return res.status(403).json("Token is not valid");
  
      const q = "SELECT * FROM users WHERE id = ?";
      db.query(q, [user.id], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.status(200).json(info);
      });
    });
  };
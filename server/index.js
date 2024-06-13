import express from "express";
const app = express();
import routes from './routes/index.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import multer from 'multer';



// Middlewares
// Basically allowing access to the react app and also allowing the react app to use the cookies
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next();
})
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}))
app.use(cookieParser())

// Using multer for uploading of files create a upload folder in public and upload with a unique name including date.now
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../react-social-media/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    } 
  })
const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req,res) => {
    const file = req.file;
    res.status(200).json(file.filename)
})

app.use(routes)


app.listen(8800, () => {
    console.log("You are now connected to Port: 8800")
})
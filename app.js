
const express = require("express");
const axios = require("axios");
const potatoRoutes = require("./routes/potato");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const userAgentFilter = require("./middlewares/userAgentFilter");
const limiter = require("./middlewares/limiter");
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");
const ConnectDB = require("./config/config");
require("dotenv").config(); // تحميل متغيرات البيئة من .env

const app = express();
const port = process.env.PORT || 3001;

// إعدادات عامة
app.disable("x-powered-by");
app.use(userAgentFilter);
app.use(cookieParser());
 const allowedOrigins = [
      'http://localhost:3000',
      'https://projecto-ht6g72ryx-yahiatrs-projects.vercel.app' // عدّلها حسب اسم موقعك ع Render
    ];

    app.use(cors({
      origin: function(origin, callback) {
        // السماح بالطلبات بدون origin (مثل Postman أو نفس السيرفر)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

app.use(express.json());
ConnectDB();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// إعدادات الجلسة
// const sessionSecret = process.env.SESSION_SECRET || "default_session_secret";
// app.use(session({
//   secret: sessionSecret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     sameSite: "lax"
//   }
// }));

    app.use(session({
      secret: "Secret",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://user1:Eainvu1EXlLCncUC@cluster0.ahrtlxh.mongodb.net/",
        collectionName: 'sessions',    
        ttl: 60 * 60 * 24              
      }),
      cookie: {
        secure: true,
        httpOnly: true,
        // sameSite: "none"
          httpOnly: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24  // صلاحية الجلسة 24 ساعة
      }
    }));

// الراوتس
app.use("/api/clients", potatoRoutes);

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

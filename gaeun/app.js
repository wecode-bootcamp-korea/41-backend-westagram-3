const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("Promise Rejected!");
  });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

dotenv.config();

// health check
// 127.0.0.1:3000/ping
app.get("/ping", (req, res) => {
  res.json({ messgae: "pong!" });
});

//////////////////////////////
// Assignment2 - 유저 회원가입 //
//////////////////////////////

// http -v POST 127.0.0.1:3000/user/signup name="Troye Sivan" email="troye@gmail.com" password="troyepw" profileImage="ts_profile_image.url"
app.post("/users", async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
      name,
      email,
      password,
      profile_image
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, password, profileImage]
  );

  res.status(201).json({ message: "userCreated" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err.message);
  }
};

start();

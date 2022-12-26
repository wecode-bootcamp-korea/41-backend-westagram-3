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
    console.log("Data Source has been init");
  })
  .catch(() => {
    console.log("Promise Rejected!");
  });
app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.post("/signup", async (req, res, next) => {
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
  res.status(200).json({ message: "userCreated" });
});

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening ${PORT}`));
};

start();

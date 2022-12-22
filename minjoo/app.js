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

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

dotenv.config();

app.get("/ping", (req, res, next) => {
  res.json({ message: "pong!" });
});

// # 2. 유저 회원가입
app.post("/users", async (req, res) => {
  const { id, name, email, profile_image, password } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
		    id,
		    name,
		    email,
        profile_image,
        password
		) VALUES (?, ?, ?, ?, ?);
		`,
    [id, name, email, profile_image, password]
  );
  res.status(201).json({ message: "user created" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();

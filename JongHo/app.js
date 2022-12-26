const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { appendFile } = require("fs");
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
    console.log("DataSource initialized");
  })
  .catch((err) => {
    console.error("Error", err);
    myDataSource.destroy();
  });

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/ping", (request, response) => {
  response.status(201).send("pong");
});

//create a user
app.post("/user", async (request, response) => {
  const { name, email, profileImageUrl, password, age } = request.body;
  const saltOrRounds = 12;
  const hashPassword = await bcrypt.hash(password, saltOrRounds);
  await myDataSource.query(
    `INSERT INTO users (name,email,profile_image,password,age) VALUES (?,?,?,?,?);`,
    [name, email, profileImageUrl, hashPassword, age]
  );
  response.status(201).json({ message: "userCreated" });
});

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};
start();

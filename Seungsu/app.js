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
  res.status(201).json({ message: "userCreated" });
});

app.post("/post", async (req, res, next) => {
  const { title, content, imageUrl, userId } = req.body;
  await myDataSource.query(
    `INSERT INTO posts(
        title,
        content,
        image_url,
        user_id
      ) VALUES (?, ?, ?, ?);
      `,
    [title, content, imageUrl, userId]
  );

  res.status(201).json({ message: "postcreated" });
});

app.get("/posts", async (req, res, next) => {
  const data = await myDataSource.query(
    `SELECT
    p.user_id as userId,
    users.profile_image as userProfileImage,
    p.id as postingId,
    p.image_url as postingImageUrl,
    p.content as postingContent
    FROM posts p
    INNER JOIN users on p.user_id = users.id`
  );
  res.status(200).json({ data: data });
});

app.get("/posts/users/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const data = await myDataSource.query(
    `SELECT
    u.id as userId,
    u.profile_image as userProfileImage,
    json_arrayagg(
      json_object('postingId', p.id, 'postingImage', p.image_url, 'postingContent', p.content
      )) as postings
      from users u
      inner join posts p 
      on u.id = p.user_id
      where u.id = ${userId}
      group by u.id;
      `
  );
  res.status(200).json({ data: data });
});

app.patch("/modify/posts/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  const { content } = req.body;
  await myDataSource.query(`UPDATE posts SET content =? WHERE id = ?;`, [
    content,
    postId,
  ]);
  const data = await myDataSource.query(
    `SELECT
    u.id as userId,
    u.name as userName,
    p.id as postingId,
    p.title as postingTitle,
    p.content as postingContent
    from users u
    inner join posts p 
    on u.id = p.user_id
    where p.id = ?;`,
    [postId]
  );

  res.status(200).json({ data: data });
});

app.delete("/delete/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  await myDataSource.query(
    `DELETE 
     FROM 
     posts 
     WHERE posts.id = ${postId};`
  );
  res.status(200).json({ message: "postingDeleted" });
});

app.post("/like", async (req, res, next) => {
  const { userId, postId } = req.body;
  await myDataSource.query(
    `INSERT INTO likes(
      user_id,
      post_id
      ) VALUES (?, ?);`,
    [userId, postId]
  );
  res.status(201).json({ message: "likeCreated" });
});

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening ${PORT}`));
};

start();

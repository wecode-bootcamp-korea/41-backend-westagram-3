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

////////////////////////////
// Assignment3 - 게시글 등록 //
////////////////////////////

app.post("/posts", async (req, res) => {
  const { title, postImage, content, userId } = req.body;
  console.log(title, postImage, content, userId);

  const post = await myDataSource.query(
    `INSERT INTO posts(
      title,
      post_image,
      content,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, postImage, content, userId]
  );
  res.status(201).json({ message: "postCreated" });
});

////////////////////////////////
// Assignment4 - 전체 게시글 조회 //
////////////////////////////////

app.get("/posts", async (req, res) => {
  await myDataSource.manager.query(
    `SELECT
      u.id AS userId,
      u.profile_image AS userProfileImage,
      p.id AS postingId,
      p.post_image AS postingImageUrl,
      p.content AS postingContent
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id;
    `,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

////////////////////////////////
// Assignment5 - 유저 게시글 조회 //
////////////////////////////////

app.get("/posts/:userId", async (req, res) => {
  const { userId } = req.params;

  const [postsList] = await myDataSource.manager.query(
    `SELECT
      u.id AS userId,
      u.profile_image AS userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'postingId', p.id,
          'postingImageUrl', p.post_image,
          'postingContent', p.content
        )
      ) AS postings
    FROM posts p
    INNER JOIN users u ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id;
    `,
    [userId]
  );

  res.status(200).json({ data: postsList });
});

/////////////////////////////
// Assignment6 - 게시글 수정 //
////////////////////////////

app.patch("/posts", async (req, res) => {
  const { postId, content } = req.body;

  // 게시글 수정
  await myDataSource.manager.query(
    `UPDATE
      posts
    SET
      content = ?
    WHERE posts.id = ?`,
    [content, postId]
  );

  // 반환
  const [post] = await myDataSource.manager.query(
    `SELECT
      u.id AS userId,
      u.name AS userName,
      p.id AS postignId,
      p.title AS postingTitle,
      p.content AS postingContent
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id
    WHERE p.id = ?`,
    [postId]
  );

  res.status(200).json({ data: post });
});

/////////////////////////////
// Assignment7 - 게시글 삭제 //
////////////////////////////

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  await myDataSource.manager.query(
    `DELETE 
    FROM posts 
    WHERE posts.id = ?`,
    [postId]
  );
  res.status(200).json({ message: "postingDeleted" });
});

//////////////////////////////
// Assignment8 - 좋아요 누르기 //
/////////////////////////////

app.post("/likes", async (req, res) => {
  const { userId, postId } = req.body;

  await myDataSource.manager.query(
    `INSERT INTO 
      likes (user_id, post_id) 
    VALUES (?, ?)
    `,
    [userId, postId]
  );

  res.status(201).json({ message: "likeCreated" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err.message);
  }
};

start();

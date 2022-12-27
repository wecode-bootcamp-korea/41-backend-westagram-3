require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateToken } = require("./middleware/auth");
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

// health check
app.get("/ping", (req, res) => {
  res.json({ messgae: "pong!" });
});

//////////////////////////////
// Assignment2 - 유저 회원가입 //
//////////////////////////////

app.post("/signUp", async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await myDataSource.query(
    `INSERT INTO users(
      name,
      email,
      password,
      profile_image
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, hashedPassword, profileImage]
  );

  res.status(201).json({ message: "userCreated" });
});

// Bcrypt Verification 및 JWT 발급하기
app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  const [userData] = await myDataSource.query(
    `SELECT
      *
    FROM 
      users
    WHERE 
      email = ?`,
    [email]
  );

  if (!userData) {
    return res.status(401).json({ message: "Invalid User" });
  }

  const result = await bcrypt.compare(password, userData.password);

  if (!result) {
    return res.status(401).json({ message: "Invalid User" });
  }

  const jwtToken = jwt.sign({ userId: userData.id }, process.env.secretKey);

  return res.status(200).json({ accessToken: jwtToken });
});

////////////////////////////
// Assignment3 - 게시글 등록 //
////////////////////////////

app.post("/post", validateToken, async (req, res) => {
  const { title, postImage, content } = req.body;

  await myDataSource.query(
    `INSERT INTO posts(
      title,
      post_image,
      content,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, postImage, content, req.userId]
  );
  res.status(201).json({ message: "postCreated" });
});

////////////////////////////////
// Assignment4 - 전체 게시글 조회 //
////////////////////////////////

app.get("/posts", async (req, res) => {
  await myDataSource.query(
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

app.get("/post/userId/:userId", async (req, res) => {
  const { userId } = req.params;

  const [postsList] = await myDataSource.query(
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

app.patch("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

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
  const [post] = await myDataSource.query(
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

app.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  await myDataSource.query(
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

app.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  const [likesRecord] = await myDataSource.query(
    `SELECT
      likes.id
    FROM likes
    WHERE likes.user_id = ?
    AND likes.post_id = ?`,
    [userId, postId]
  );

  if (!likesRecord) {
    await myDataSource.query(
      `INSERT INTO
      likes
        (user_id, post_id)
      VALUES (?, ?)
    `,
      [userId, postId]
    );

    res.status(201).json({ message: "likeCreated" });
  } else {
    await myDataSource.query(
      `DELETE
      FROM likes
      WHERE likes.id = ?
    `,
      [likesRecord.id]
    );

    res.status(200).json({ message: "likeDeleted" });
  }
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err.message);
  }
};

start();

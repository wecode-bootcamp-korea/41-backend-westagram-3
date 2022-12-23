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

/////////////////////
// # 2. 유저 회원가입 //
/////////////////////
app.post("/users", async (req, res) => {
  const { id, name, email, profileImageUrl, password } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
		    id,
		    name,
		    email,
        profileImageUrl,
        password
		) VALUES (?, ?, ?, ?, ?);
		`,
    [id, name, email, profileImageUrl, password]
  );
  res.status(201).json({ message: "user created" });
});

///////////////////
// # 3. 게시글 등록 //
///////////////////
app.post("/posts", async (req, res) => {
  const { id, title, content, userId, imageUrl } = req.body;

  await myDataSource.query(
    `INSERT INTO posts(
        id, 
        title, 
        content, 
        userId,
        imageUrl
          ) VALUES (?, ?, ?, ?, ?);
          `,
    [id, title, content, userId, imageUrl]
  );
  res.status(201).json({ message: "post created" });
});

///////////////////////
// # 4. 전체 게시글 조회 //
///////////////////////
app.get("/posts", async (req, res) => {
  await myDataSource.query(
    `SELECT 
    users.id AS userId, 
    users.profileImageUrl AS userProfileImage,
    posts.id AS postingId,
    posts.imageUrl AS postingImageUrl,
    posts.content AS postingContent
    FROM users
    INNER JOIN posts ON posts.userId = users.id`,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

///////////////////////
// # 5. 유저 게시글 조회 //
///////////////////////
app.get("/posts/:userId", async (req, res) => {
  const { userId } = req.params;

  const [post] = await myDataSource.query(
    `SELECT
    users.id AS userId,
    users.profileImageUrl AS userProfileImage,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        "postingId", posts.id,
        "posingImageUrl", imageUrl,
        "postingContent", posts.content
      )
    ) AS postings
    FROM posts
    INNER JOIN users ON users.id = posts.userId
    WHERE users.id = ?
    GROUP BY users.id;`,
    [userId]
  );
  res.status(200).json({ data: post });
});

///////////////////////////
// # 6. 유저 게시글 수정 //
//////////////////////////
app.put("/posts", async (req, res) => {
  const { userId, id, postingContent } = req.body;

  // 게시글 수정
  await myDataSource.query(
    `UPDATE posts
		    SET
        content = ?
			WHERE userId = ? AND id = ?
		`,
    [postingContent, userId, id]
  );

  const [post] = await myDataSource.query(
    `SELECT
      posts.userId AS userId,
      users.name AS userName,
      posts.id AS postingId,
      posts.title AS postingTitle,
      posts.content AS postingContent
    FROM posts
    INNER JOIN users ON users.id = posts.userId
    WHERE posts.id = ?`,
    [id]
  );
  res.status(200).json({ data: post });
});

//////////////////
// # 7.게시글 삭제 //
//////////////////
app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  await myDataSource.query(
    `DELETE FROM posts
		WHERE posts.id = ${postId}
		`
  );
  res.status(200).json({ message: "post deleted" });
});

///////////////
// # 8.좋아요 //
//////////////
app.post("/likes", async (req, res) => {
  const { userId, postId } = req.body;

  const [like] = await myDataSource.query(
    `SELECT id
    From likes 
    WHERE user_id = ? AND post_id = ?`,
    [userId, postId]
  );

  // if (!like.length === 0) {
  if (!like) {
    await myDataSource.query(
      `INSERT INTO likes(
        user_id,
        post_id
          ) VALUES (?, ?);
          `,
      [userId, postId]
    );
    res.status(201).json({ message: "like created" });
  } else {
    await myDataSource.query(
      `DELETE FROM likes WHERE user_id = ? AND post_id = ?
      `,
      [userId, postId]
    );
    res.status(201).json({ message: "like deleted" });
  }
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");

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

//create a post
app.post("/post", async (request, response) => {
  const { title, content, userId, imageUrl } = request.body;
  await myDataSource.query(
    `INSERT INTO posts (title,content,user_id,image_url) VALUES (?,?,?,?);`,
    [title, content, userId, imageUrl],
    response.status(201).json({ message: "postCreated" })
  );
});

//inquire posts
app.get("/posts", async (request, response) => {
  await myDataSource.query(
    `SELECT 
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId, 
        posts.image_url as postingImageUrl,
        posts.content as postingContent 
    FROM users 
    INNER JOIN posts 
    ON posts.user_id=users.id;`,
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        response.status(200).json({ data: results });
      }
    }
  );
});

//inquire specific user's posts
app.get("/post/userId/:userId", async (request, response) => {
  const userId = request.params.userId;
  const results = await myDataSource.query(
    `SELECT
        u.id AS userId,
        u.profile_image AS userProfileImage,
        JSON_ARRAYAGG(
            JSON_OBJECT("postingId", p.id, "postingImageUrl", p.image_url, "postingContent", p.content)
                    ) AS postings
    FROM users u
    INNER JOIN posts p
    ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id;
    `,
    [userId]
  );
  response.status(200).json({ data: results });
});

//modify a post
app.put("/post/:postingId", async (request, response) => {
  const postingId = request.params.postingId;
  const { content } = request.body;
  await myDataSource.query(
    `UPDATE 
        posts 
    SET content=? 
    WHERE posts.id=?;`,
    [content, postingId]
  );
  const [results] = await myDataSource.query(
    `SELECT 
        posts.user_id as userId,
        users.name as userName,
        posts.id as postingId,
        posts.title as postingTitle,
        posts.content as postingContent
    from posts 
    inner join users 
    on posts.user_id=users.id 
    where posts.id=?`,
    [postingId]
  );
  response.status(200).json({ data: results });
});

//delete a post
app.delete("/post/:postingId", async (request, response) => {
  const postingId = request.params.postingId;
  await myDataSource.query(
    `DELETE 
        FROM posts
    WHERE posts.id=?;`,
    [postingId]
  );
  response.status(200).json({ message: "postingDeleted" });
});

//create and delete a like
app.post("/postLike/:userId/:postId", async (request, response) => {
  const { userId, postId } = request.params;
  const [check] = await myDataSource.query(
    `SELECT * FROM likes WHERE user_id=? AND post_id=?`,
    [userId, postId]
  );
  if (!check) {
    //create
    await myDataSource.query(
      `INSERT INTO likes (user_id,post_id) VALUES (?, ?)`,
      [userId, postId]
    );
    response.status(201).json({ message: "likeCreated" });
  } else {
    //delete
    await myDataSource.query(
      `DELETE FROM likes WHERE user_id=? AND post_id=?`,
      [userId, postId]
    );
    response.status(200).json({ message: "likeDeleted" });
  }
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

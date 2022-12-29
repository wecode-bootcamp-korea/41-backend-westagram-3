const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

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
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
        myDataSource.destroy();
    });

app.get('/ping', function (req, res, next) {
    res.json({ message: 'pong' });
});

///유저회원가입////Assignment 2/////
///////////////////////////////////

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    await myDataSource.query(
        `
        INSERT INTO users (
            email,
            password,
          ) VALUES (?,?)
          `,
        [email, password]
    );
    res.status(201).json({ message: 'userCreated' });
});

////////////////////로그인/////////////////////
///////Bcrypt Verification 및 JWT 발급하기//////
app.post('/signIn', async (req, res) => {
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
        return res.status(401).json({ message: 'Invalid User' });
    }

    const result = await bcrypt.compare(password, userData.password);

    if (!result) {
        return res.status(401).json({ message: 'Invalid User' });
    }

    const jwtToken = jwt.sign({ userId: userData.id }, process.env.secretKey);

    return res.status(200).json({ accessToken: jwtToken });
});

///게시물등록////Assignment 3///////
///////////////////////////////////

app.post('/posting', async (req, res) => {
    const { title, content, userId, imageUrl } = req.body;

    await myDataSource.query(
        `
        INSERT INTO posts (
            title,
            content,
            user_id,
            image_url
        ) VALUES (?,?,?,?)
        `
        // [title, content, user_id, imageUrl]
    );
    console.log('갓구리');
    res.status(201).json({ message: 'post_created' });
});

///전체게시물조회////Assignment 4/////
/////////////////////////////////

app.get('/posts', async (req, res) => {
    await myDataSource.query(
        `
        SELECT
            u.id AS userId,
            u.profile_image AS userProfileImage,
            p.id AS postingId,
            p.post_image AS postingImageUrl,
            p.content AS postingContent
        FROM users u
        INNER JOIN posts p 
        ON u.id = p.user_id;
        `,
        (err, rows) => {
            res.status(200).json({ data: rows });
        }
    );
});

//유저게시물조회////Assignment 5/////
/////////////////////////////////////

app.get('/post/userId/:userId', async (req, res) => {
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

const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();

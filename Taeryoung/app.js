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
    const { name, email, password, profileImages } = req.body;

    await myDataSource.query(
        `
        INSERT INTO users (
            name,
            email,
            password,
            profile_image

        ) VALUES (?,?,?,?)
        `,
        [name, email, password, profileImages]
    );
    res.status(201).json({ message: 'userCreated' });
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
        `,
        [title, content, userId, imageUrl]
    );
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
            p.image_url AS postingImageUrl,
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

//유저게시물조회////Assignment 5///////
/////////////////////////////////////
app.get('/post/:userId', async (req, res) => {
    const { userId } = req.params;

    const [postsList] = await myDataSource.query(
        `
        SELECT
        u.id AS userId,
        u.profile_image AS userProfileImage,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'postingId', p.id,
                'postingImageUrl', p.image_url,
                'postingContent', p.content
            )
        ) AS postings
        FROM posts p
        INNER JOIN users u 
        ON u.id = p.user_id
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

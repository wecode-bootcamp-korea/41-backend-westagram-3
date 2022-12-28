
const express = require ("express");
const cors = require ("cors");
const morgan = require ("morgan");
const { DataSource } = require('typeorm');
const dotenv = require("dotenv");
dotenv.config()

const app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
        myDataSource.destroy();
      });

///유저회원가입////Assignment 2///// 

app.post("/signup", async (req, res) => {
    const {name, email, password} = req.body;
    
    await myDataSource.query(
          `
        INSERT INTO users (
            name,
            email,
            password
          ) VALUES (?,?,?)
          `,
          [name , email, password]
        );
        res.status(201).json({ message: "userCreated" })
});


    app.get('/ping', function (req, res, next) {
        res.json({message: 'pong'})
    })

const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
}

start()
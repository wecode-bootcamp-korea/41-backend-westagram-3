
const express = require ("express");
const cors = require ("cors");
const morgan = require ("morgan");
const dotenv = require("dotenv");
dotenv.config()

app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


// app.get ("/ping", (req, res) => {
//     res.json({ message : "pong"});
// });

app.get('/ping', cors(), function (req, res, next) {
    res.json({message: 'pong'})
})

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
}

start()

import { perserFromFileWords, userSchema, inserNewWordsToDB, findSpecificUser, deleteWordAndUpdateLearned } from './Logics_English_Project.js';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';
import { promisify } from 'util';

const app = express()
const port = 3001
const unlinkAsync = promisify(fs.unlink)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const dbURI = 'mongodb+srv://guyhassan:g12345g@trans-eng-heb.zf8u2.mongodb.net/trans-word?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        })
        console.log('connected to DB');
    })
    .catch(err => console.log('DB - ', err))


app.use(function (req, res, next) {
    const allowedOrigins = [
        "http://localhost:3000",
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH");
    next();
});
app.post('/addWord', (req, res) => {
    const { word, user } = req.body;
    inserNewWordsToDB(user, word)
})

// delete specific word and update the wordLearned (history words) attribute
app.delete('/deleteWord', (res, req) => {
    const { user, word } = req.body;
    deleteWordAndPassLearned(user, word);
})

// const { professionName, className } = req.params;
app.get('/getWords/:username', async (req, res) => {

    const { username } = req.params;

    const { words, wordsLearned } = (await findSpecificUser(username))[0];
    res.send(JSON.stringify({ words, wordsLearned }));
})

app.post('/login', async (req, res) => {
    const { username } = req.body;
    const userFound = await findSpecificUser('guyhassan');
    // Schema is built only when the user does not exist !
    !userFound.length && userSchema('guyhassan')
})

let upload = multer({ dest: 'uploads/' });
// get txtfile, parser him, and update the database with the new words and translate
app.post('/parserTxtFile', upload.single('myFile'), (req, res) => {
    const txtFile = req.file;
    const { username } = req.body
    let words = [];

    if (txtFile.originalname.includes('.txt'))
        words = perserFromFileWords(txtFile.path)

    unlinkAsync(txtFile.path)// Delete the file before he save him !
    if (words.length) {
        inserNewWordsToDB(username, words)
        res.send('DB Is Updated!');
        return
    }
    res.send('This File Cannot Be Parser!');
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})
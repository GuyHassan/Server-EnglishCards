
import fs from 'fs';
import { wordsByUser } from './Mongoose_Models_Schema.js';

const perserFromFileWords = (file) => {
    const str = fs.readFileSync(file, 'utf8')
    const [english, hebrew] = str.split('\r\n$\r\n').map(x => x.split('\r\n'));

    if (!english || !hebrew) return [];
    const words = english.reduce((p, c, i) => {
        const [eng, heb] = [c, hebrew[i].split('').reverse().join('')]
        return [...p, `${eng} - ${heb}`]
    }, [])

    return words;
}

//   Mongoose Functions !

const userSchema = (username) => {
    const userWords = new wordsByUser({
        user: username,
        word: [],
        wordsLearned: []
    })
    userWords.save()
        .then(res => console.log('New User is Join! -', res))
        .catch(err => console.log(err))
}

const deleteWordAndUpdateLearned = (user, word) => {
    wordsByUser.updateOne({ user }, { $pull: { words: word }, $addToSet: { wordsLearned: word } }, (err, succes) => {
        if (err) console.log('Somthing wrong with delete word!', err);
        else console.log('Delete and update is successful - ', succes)
    })
}

const inserNewWordsToDB = (user, words) => {
    return wordsByUser.updateOne({ user }, { $addToSet: { words } }, (err, res) => {
        if (err) return 'Somthing Wrong With Update The DB';
        else console.log('DB Is Updated!')
    })
}

const findSpecificUser = async (user) => {
    return await wordsByUser.find({ user }).exec();
}

export { perserFromFileWords, userSchema, inserNewWordsToDB, findSpecificUser, deleteWordAndUpdateLearned };
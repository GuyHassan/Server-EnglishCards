import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const wordsUser = new Schema({
    user: { type: String, required: true },
    words: { type: Array, required: true },
    wordsLearned: { type: Array, required: true }
}, { timestamps: true })

const wordsByUser = mongoose.model('users', wordsUser);
// const dynamicModel = (name) => {
//     return mongoose.model(name, words);
// }
export { wordsByUser }
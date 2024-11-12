const mongoose = require('mongoose');

const mongo_url = "mongodb+srv://vajaniharsh124:vajaniharsh124@cluster0.sniikzk.mongodb.net/";

mongoose.connect(mongo_url)
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })


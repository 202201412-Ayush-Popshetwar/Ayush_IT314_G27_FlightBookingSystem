
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    
    const UserSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    });
    const productSchema= new Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        productId: {
            type: Number,
            required: true,
        }
    })
    const UserModel = mongoose.model('users', UserSchema);
    module.exports = UserModel;
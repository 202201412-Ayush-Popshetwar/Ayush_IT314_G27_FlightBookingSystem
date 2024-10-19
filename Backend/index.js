const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
app.use(cors());

app.use(bodyParser.json());

require('./Models/db');
const PORT =  8090;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/auth', AuthRouter);
app.use('/products',ProductRouter);
// app.use('/products',(req,res)=>{
//     res.send({
//         "message":"hey there"})
// });

app.use('/checkout',(req,res)=>{
    res.send({
        "message":"checkout page"})
});
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
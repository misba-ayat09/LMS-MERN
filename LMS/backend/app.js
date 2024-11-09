const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
const memberroutes = require('./routes/member-routes');
const bookroutes = require('./routes/book-routes');
const genreroutes = require('./routes/genre-routes');
const rentroutes = require('./routes/rent-routes');
const adminroutes = require('./routes/admin-routes');
const roleroutes = require('./routes/role-routes');

app.use(bodyParser.json());
// to handle cors policy error
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization');
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
        );
    next();
 })
 // Set up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/member', memberroutes);
app.use('/api/book',bookroutes);
app.use('/api/genre',genreroutes);
app.use('/api/rental',rentroutes);
app.use('/api/admin',adminroutes);
app.use('/api/role',roleroutes);

app.use((req,res,next)=>{
    const error = new HttpError('Could not find this route',404);
    throw error;
});

app.use((err,req,res,next)=>{
    // if the response is sent it will pass to another middleware
    if(res.headerSent){
        return next(err)
    }
    res.status(err.code || 500);
    res.json({message: err.message} || 'An unknown error occured');
})


mongoose.connect('mongodb+srv://sahayamisba:Faith@faithcluster.ei6sb.mongodb.net/library?retryWrites=true&w=majority&appName=Faithcluster')
.then(()=>{
    // to start the server
    app.listen(5000);
}).catch(err=>{
    console.log(err)
})
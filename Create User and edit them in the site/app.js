const express = require('express');
const { get } = require('http');
const app = express();
const path = require('path');

const userModel = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
    res.render('index');
});

app.post('/create', async function(req,res){
    console.log(req.body);
    let {name, email, image} = req.body;
    let createduser = await userModel.create({
        name,
        email,
        image
    });
    res.redirect('/read');
});
app.get('/read', async function(req,res){
    let allusers = await userModel.find({});
    res.render('read', {users: allusers});
});
app.get('/edit/:id', async function(req,res){
    let oneuser = await userModel.findById(req.params.id);
    res.render('edit', {oneuser});
});
app.post('/edit/:id', async function(req,res){
    let {changedname, changedemail, changedimage} = req.body;
    let user = await userModel.findByIdAndUpdate(req.params.id, {name: changedname, email: changedemail, image: changedimage}, {returnDocument: 'after'});
    console.log(user);
    res.redirect('/read');
});



app.listen(3000, function(){
    console.log('Server is running on port http://localhost:3000');
}); 
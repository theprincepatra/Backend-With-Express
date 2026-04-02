const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render('index', {files: files});
    })
});
app.post('/create', function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err) {
        res.redirect('/');
    });
});
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
        if(err) return console.log("File not found");

        res.send(data);
    });
});


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
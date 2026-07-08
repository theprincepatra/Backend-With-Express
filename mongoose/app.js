const express = require('express');
const app = express();

const userModel = require("./usermodel")

app.get('/', (req, res) => {
    res.send("Hey")
});

app.get("/create", async (req, res) =>{
    let createduser = await userModel.create({
        name: "Prince",
        username: "TPP",
        email: "princepatra@gmail.com",
    })
    res.send(createduser);
})

app.listen(3000, function(){
    console.log('Server is running on port http://localhost:3000');
});
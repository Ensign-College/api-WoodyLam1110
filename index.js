const express = require('express');
//express make apis - connect frontend to database

const app = express();//create an express application

app.listen(3000); // listen for web requests from the frontend and don't stop

const boxes = [
{boxId:1},
{boxId:2},
{boxId:3},
{boxId:4},
];
//1-url
//2- a function to return boxes
//req = the request from the browser
//res = the response to the browser
app.get('/boxes',(req,res)=>{//return boxes to the user
    res.send(JSON.stringify(boxes));//convert boes to a string
});
console.log("Hello");

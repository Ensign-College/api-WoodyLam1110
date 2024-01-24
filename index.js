const express = require('express');//express make apis - connect frontend to database
const Redis =require('redis');//import the Redis library


const redisClient =Redis.createClient({
    url:`redis://localhost:6379`

});

const app = express();//create an express application
const port =3000; //port number
app.listen(port,()=>{
    redisClient.connect();
    console.log (`API is Listening on port:${port}`);
}); // listen for web requests from the frontend and don't stop

// const boxes = [

//     // {boxId:1},
//     // {boxId:2},
//     // {boxId:3},
//     // {boxId:4},
// ];hard codeed boxes - not in the database
//1-url
//2- a function to return boxes
//req = the request from the browser
//res = the response to the browser
app.get('/boxes', async (req,res)=>{//return boxes to the user\
    let boxes = await redisClient.json.get('boxes',{path:'$'});//get the boxes
    //send boxes to the browser
    res.send(JSON.stringify(boxes));//convert boes to a string
}); //return boxes to user
console.log("Hello");

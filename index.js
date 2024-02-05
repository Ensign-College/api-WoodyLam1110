const express = require('express');//express make apis - connect frontend to database
const Redis = require('redis');//import the Redis library
const bodyParser = require('body-parser');//body parser pass the request from JS to JSon
const cors = require('cors');
const options ={
    origin:"http://localhost:3000"}

const redisClient =Redis.createClient({
    url:`redis://localhost:6379`

});

const app = express();//create an express application
const port =3001; //port number

app.use(bodyParser.json());
app.use(cors(options));

app.listen(port,()=>{
    redisClient.connect();//connect to the database
    console.log (`API is Listening on port:${port}`);
}); // listen for web requests from the frontend and don't stop

app.post('/boxes',async (req,res)=>{//async means we wait for the promise
    const newBox = req.body;//created new box
    newBox.id= parseInt(await redisClient.json.arrLen('boxes','$'))+1;// defult box id, user can't change it
    await redisClient.json.arrAppend('boxes','$',newBox);//save the json in redis
    res.json(newBox);//respond with the new box
});

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
    res.json(boxes[0]);//convert boes to a string
}); //return boxes to user


console.log("Hello");

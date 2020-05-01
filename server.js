const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const Schema=mongoose.Schema;

const PersonSchema = new Schema ({
  
  username: String,
  exercise: [{
    desc : String,
    duration: Number,
    date : {}
  }]
});

var Person = mongoose.model('Person', PersonSchema); 

const createPerson = (name, done) => {
  Person.findOne({username:name}, (err,findData)=>{
    if (findData == null){
      //no user currently, make new
      const person = new Person({username : name, exercise : []});
      person.save((err,data)=>{
        if(err){
          done(err);
        }
        done(null , data);
      });
    }else if (err){
      done(err);
    }else{
      //username taken
      done(null,"taken");
    }
  });
};

app.post('/api/exercise/new-user',(req,res) => {
  createPerson(req.body.username, (err,saveData)=>{
    if(err){
      res.send({error:"Error, Please try again"});
    }else if (saveData = 'taken'){
      res.send({"error":"Username already taken"})
    }else{
      res.send({"username":saveData.username,"id":saveData.shortId});
    }
  });
});













app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//app.post("/api/exercise/new-user", function(req,res){
 // let userName = req.body.username;
 // let newUser = new Person({username:name});
  
  
 // res.json({username:req.body.username, _id:"id"})

//})











// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})








const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

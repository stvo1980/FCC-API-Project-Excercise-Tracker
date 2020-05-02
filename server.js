const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortId = require('shortid')
const cors = require('cors')
var autoIncrement = require('mongoose-auto-increment')
const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
.then(() => console.log("DB Connected!"))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });


//need to switch to shortId after finishing work
//const connection = mongoose.createConnection(process.env.MLAB_URI)
//autoIncrement.initialize(connection)


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const Schema=mongoose.Schema;

const PersonSchema = new Schema ({
 // shortId: {type: String, unique: true, default: shortId.generate},
 username: { type: String, required: true, unique: true },
  _id: { type: String, default: shortId.generate },
 exercise: [{
    description : String,
    duration: Number,
    date : { type: Date, default: Date.now()}
  }]
});

var Person = mongoose.model('Person', PersonSchema); 

//PersonSchema.plugin(autoIncrement.plugin, 'Person')

//const Person = connection.model('Person', PersonSchema)



const createUser = (username, done) => {
  const newUser = new Person({
    username: username
  })
  .save((err, data) => {
    if(err) return done(err)
    return done(null, data)
  })
  
}


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
//check if username is already exists
var findUserByUsername = function(username, done) {
  Person.find({name: username}, function(err,peopleFound){
    if(err) return console.log(err);
    done(null, peopleFound);
  })
  };



app.post("/api/exercise/new-user", function(req,res){
 // let userName = req.body.username;

 let user = new Person({ username: req.body.username});
  user.save(err => {
    if (err) {
      return res.send({
        success: false,
        message: "Sorry, this name already exists"
      })
    }
    res.send({username: user.username, _id: user._id});
  })
  
   })

app.post("/api/exercise/add", function(req,res){
 // let userName = req.body.username;
  if(req.body.date)
{Person.findOneAndUpdate({_id: req.body.userId},{$push: {exercise:{
      description: req.body.description, 
      duration: req.body.duration,
      date: req.body.date
    }}},{ "new": true, "upsert": true },(err, data) => {
    if (err) return res.send(err);
    res.send({username: data.username, description: req.body.description, duration:req.body.duration, date:})
    })}
  else {
    Person.findOneAndUpdate({_id: req.body.userId},{$push: {exercise:{
      description: req.body.description, 
      duration: req.body.duration
      }}},{ "new": true, "upsert": true },(err, data) => {
    if (err) return res.send(err);
    res.send({username: data.username, description: req.body.description, duration:req.body.duration})
    })
  }
   
   })






//userstory 3 create an array of all users
app.get("/api/exercise/users", (req, res) => {
  Person.find({}, (err, users) => {
    if (err) return res.send(err);
    let result = [];
    users.forEach(user => {
      result.push({username: user.username, _id: user._id});
    });
    res.json(result)
  });
});










// Not found middleware
//app.use((req, res, next) => {
 // return next({status: 404, message: 'not found'})
//})

// Error Handling middleware
//app.use((err, req, res, next) => {
//  let errCode, errMessage

 // if (err.errors) {
    // mongoose validation error
 //   errCode = 400 // bad request
 //   const keys = Object.keys(err.errors)
    // report the first validation error
 //   errMessage = err.errors[keys[0]].message
 // } else {
    // generic or custom error
//    errCode = err.status || 500
 //   errMessage = err.message || 'Internal Server Error'
 // }
//  res.status(errCode).type('txt')
//    .send(errMessage)
//})








const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

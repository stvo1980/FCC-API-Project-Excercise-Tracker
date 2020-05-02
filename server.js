const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortId = require('shortid')
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const Schema=mongoose.Schema;

const PersonSchema = new Schema ({
  shortId: {type: String, unique: true, default: shortId.generate},
  username: String,
  exercise: [{
    desc : String,
    duration: Number,
    date : {}
  }]
});

var Person = mongoose.model('Person', PersonSchema); 

const createUser = (newURL, done) => {
  const newUser = new PersonSchema({
    url: newURL
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


app.post("/api/exercise/new-user", function(req,res){
  let userName = req.body.username;

  createUser(userName, function(err,data){
    res.json({username:userName, id:data._id})
  });
   
    
   
  
 

})


var findPeopleByName = function(personName, done) {
  Person.find({name: personName}, function(err,peopleFound){
    if(err) return console.log(err);
    done(null, peopleFound);
  })
  

};


app.post("/api/exercise/new-user", function(req,res){
  let userName = req.body.username;
 // let newUser = new Person({username:name});
  createPerson(userName);
   
    
   res.json({username:userName})
  
 

})






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

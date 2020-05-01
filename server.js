const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 3000 )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const Schema=mongoose.Schema;

var personSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  description: String,
  duration: Number,
  date: Date

})
var Person = mongoose.model('Person', personSchema); 

var createAndSavePerson = function(done) {
  var newUser = new Person({});

  newUser.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};



app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


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

app.get("/api/exercise/new-user", function(req, res) {
 

  res.send({username:req.query.username});
})

app.post("/api/exercise/new-user", function(req,res){
  res.json({username: "kellld"})
 // res.json({username: req.body.username})
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

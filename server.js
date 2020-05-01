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
  exercise:[{
    description: String,
    duration: Number,
    date: {}
  }]

})
var Person = mongoose.model('Person', personSchema); 

var createAndSaveUser = function(name, done) {
  
      var newUser = new Person({username:name});
      newUser.save(function(err,data){
        if (err) return done(err);
        done(null, data)
      })
    
  
}

 app.post('/api/exercise/new-user',(req,res) => {
  createAndSaveUser(req.body.username, (err,data)=>{
    if(err){
      res.send({error:"Error, Please try again"});
    }else if (data = 'taken'){
      res.send({"error":"Username already exist"})
    }else{
      res.json({"username":data.username,"id":data._id});
      
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

var express = require('express');
var app = express();
var user = require('./users.js').User;

// View EJS
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body Parser In Postman
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'demo';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//
//   const db = client.db(dbName);
//   console.log(db.databaseName);
//
//   client.close();
// });

app.get('/userMongo', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    console.log(db.databaseName);
    res.send(db.databaseName);
  });
});


app.get('/getUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    userCollection.find({}).toArray(function(err, result) {
      if (err)
        console.log(err);
      else {
        console.log('Get All Records');
        res.send(result);
        client.close();
      }
    });
  });
});

app.post('/removeUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    userCollection.remove({}, function(err, result) { //Viet thuan
      if (err)
        console.log(err);
      res.send('Remove All Records');
      client.close();
      // console.log(result);
      // db.close();
    });
  });
});


app.post('/createUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var userName = "User";
    var count = 1;
    for(var i = 0; i < user.length; i++)
    {
      var temp = userName + count++;
      user[i]._id = temp;
    }
    userCollection.insertMany(user).then(function(result) { //Cach viet cho ES6
      res.send(result);
    }).catch(function() {
      res.send({
        error: 400,
        message: err
      });
    });
    // res.send(db.databaseName);
  });
});

app.post('/updateUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var userID = req.body.id;
    var findUser = { _id : userID};
    userCollection.updateOne(findUser, {$set: {name : req.body.name, age :req.body.age}}).then(function(result){
      res.send('Data is updated');
    }).catch(function(){
      res.send({
        error: 400,
        message: err
      });
    });
  });
});

app.post('/sort/:number', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var isSort = parseInt(req.params.number);
    // var findUser = { _id : userID};
    var array = userCollection.find().sort({birthdate: isSort});
      array.toArray().then(function(result){
      res.send(result);
    }).catch(function(err){
      res.send(err);
    });

  });
});

app.post('/login', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var user = req.body.username;
    var pass = req.body.password;
    // console.log(username);
    // console.log(pass);
    userCollection.find({'username': user, 'password': pass}).toArray().then(function(result){
      if(result == "")
        res.send("Không tìm thấy tài khoản");
      else
        res.send("Đăng nhập thành công");
      client.close();
    }).catch(function(err){
      res.send(err);
      client.close();
    })
  });
});

app.post('/signup', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
      client.close();
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var newUser = {
      "_id": req.body.id,
      "name": req.body.name,
      "age": req.body.age,
      "username": req.body.username,
      "password": req.body.password
    };
    // var user = req.body.username;
    // var pass = req.body.password;
    // console.log(username);
    // console.log(pass);
    userCollection.find({'username': newUser.username}).toArray().then(function(result){
      if(result == "")
      {
        userCollection.insertOne(newUser).then(function(result){
          res.send("Tạo tài khoản thành công");
          client.close();
        }).catch(function(err){
          res.send("Tạo tài khoản thất bại");
          client.close();
        })
      }
      else
        res.send("Tài khoản đã tồn tại");
      client.close();
    }).catch(function(err){
      res.send(err);
      client.close();
    })
  });
});


// Index.ejs
app.get('/index', function(req, res){
  res.render('index', {data: "Hello World"});s
});
app.listen(3000);

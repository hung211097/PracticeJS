var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var user = require('../../users.js').User;

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'demo';

router.get('/getUser', function(req, res, next) {
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
        // res.send(result);
        res.render('index', {'AllUser' : result});
        client.close();
      }
    });
  });
});

router.post('/removeUser', function(req, res) {
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
      else
      {
        res.send('Remove All Records');
        client.close();
      }
    });
  });
});


router.post('/deleteUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({
        error: "mongoError",
        message: err
      });
    }
    var db = client.db(dbName);
    var userCollection = db.collection('newUser');
    var deleteItem = req.body._id;
    console.log(deleteItem);
    userCollection.remove({'_id' : deleteItem}, function(err, result) { //Viet thuan
      if (err)
        console.log(err);
      else
      {
        res.redirect('/users/getUser');
      }
    });
  });
});

router.post('/createUser', function(req, res) {
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
  });
});

router.post('/updateUser', function(req, res) {
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

router.post('/login', function(req, res) {
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
    userCollection.findOne({'username': user, 'password': pass}).then(function(result){
      if(result == "")
        res.send("Không tìm thấy tài khoản");
      else
      {
        // res.send("Đăng nhập thành công");
        var token = jwt.sign(result, "jToken", {expiresIn: 60 * 60});
        result.token = token;
        res.send(result);
        client.close();
      }
    }).catch(function(err){
      res.send(err);
      client.close();
    });
  });
});

router.post('/signup', function(req, res) {
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

module.exports = router;

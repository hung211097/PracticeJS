var express = require('express');
var app = express();


app.get('/', function(req, res){
  res.send('Hello World');
});

var users = [
  {id: "abcd", name: "Ti"},
  {id: "aasd", name: "Teo"},
  {id: "awed", name: "Tom"}
]

app.get('/users', function(req, res){
  res.send(users);
});

app.get('/user/:id', function(req, res){
    //console.log(req.params);
    var info = req.params;

    // for(var i = 0; i < users.length; i++)
    //   if(users[i].id == info.id)
    //     return res.send(users[i]);
    // return res.send("Nothing!");

    //Another way
    var temp = null;
    for(var i = 0; i < users.length; i++)
      if(users[i].id == info.id)
        {
          temp = users[i];
          break;
        }
    if(temp != null)
      res.send(temp);
    else
      res.send("Nothing!");
});

app.listen(3000);

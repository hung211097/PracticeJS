var express = require('express');
var app = express();

var user = require('./users.js').User;
const MAX = user.length;

app.get('/users', function(req, res) {
  var page = parseInt(req.query.page);
  var number = parseInt(req.query.limit);
  var isSort = parseInt(req.query.sort);
  var temp;
  var array = [];
  console.log(isSort);
  if (MAX % number != 0)
    temp = (MAX / number) + 1;
  else
    temp = MAX / number;

  if (page > temp)
    res.send("Nothing!");
  else {
    var i = (page - 1) * number;
    for (i; i < page * number && i < MAX; i++)
      array.push(user[i]);
      if(isSort == 1)
      {
        array.sort(function(a, b){
          return a.birthdate > b.birthdate;
        });
      }
      else if(isSort == -1)
      {
        array.sort(function(a, b){
          return a.birthdate < b.birthdate;
        });
      }
    res.send(array);
  }
});

app.listen(3000);

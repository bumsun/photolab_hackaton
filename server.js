

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var fileUpload = require('express-fileupload');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("Connected!");
   //db.close();
   //
});

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

var Schema = mongoose.Schema;

var Users = new Schema({
    original_url: { type: String, required: true },
    fake_url: { type: String, required: true},
    count_users_complete: { type: Number, default:0}
});

var UsersModel = mongoose.model('Users', Users);
module.exports.UsersModel = UsersModel;

app.use(express.static('views'));

app.get('*', function(req, res) {
  res.sendfile('./views/main.html');
});

app.post('/api/registerUser', function (req, res) {
  console.log("registerUser 3");

  console.log("findDifference 4");
  var spawn = require("child_process").spawn;
  var process = spawn('/usr/bin/python3', ["/root/photolab/create_fake.py",
    req.body.original_url
  ]);
  process.stdout.on('data', function(data) {
      console.log("findDifference 8");
      console.log(data.toString());

      // var user = new UsersModel({
      //      original: req.body.original_url,
      //      fake: req.body.fake_url
      // });

      // user.save(function (err) {
      //     if (err) {
      //         console.log(err);
      //     }
      // });
      return res.send({ status: 'OK', response:"1", fake_url:data.toString()});
  });
  process.stderr.on('data', (data) => {
      console.log(data.toString());
  });
});

app.post('/api/getUser', function(req, res) {
    UsersModel.find({'_id': req.body._id})
            .exec(function(err, user) {
                if (err) {
                    return res.send(err);
                }
                if (employers) {
                    return res.send(user);
                }
    });
});

app.post('/api/findDifference', function(req, res) {
    findDifference(req, res);
});

function findDifference(req, res) {
  var spawn = require("child_process").spawn;
  var process = spawn('/usr/bin/python3', ["/root/photolab/find_differents.py",
    req.body.image_url_1, req.body.image_url_2
  ]);
  process.stdout.on('data', function(data) {
      console.log("findFace 8");
      console.log(data.toString());
      res.send(data.toString());
  });
  process.stderr.on('data', (data) => {
      console.log(data.toString());
  });
}

  



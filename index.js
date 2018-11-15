var express = require('express');
var bp = require('body-parser');
var rqst = require('request');
var odysaykey = 'atfxVlgusoHTkxTFXa%2FlajJwZ%2B5qeO9sqHe%2FpOMkpBk';
var app = express();

var queryx = [], queryy = [];
var xvg, yvg;

//var client_id = 'HidmRTMmZoMwdG4DJAPw';
//var client_secret = 'A3VqfyXvR1';
app.use(express.static('source'));
app.use(bp.urlencoded({ extended : false }));
app.get('/', function (req, res){
  while (queryx.length > 0){
    queryx.pop();
    queryy.pop();
  }
  xvg = 0;
  yvg = 0;
  res.sendFile(__dirname + `/source/post.html`);
});

app.get('/result', function (req, res) {
  for (var i = 0; i < queryx.length; i++){
    xvg += queryx[i]*1;
    yvg += queryy[i]*1;
  }
  xvg = 126.9670558;
  yvg = 37.5428137;
  var rst;
  rqst(`https://api.odsay.com/v1/api/pointSearch?lang=0&x=${xvg}&y=${yvg}&radius=600&stationClass=2&apiKey=${odysaykey}`, function(err, response, body){
    rst = JSON.parse(body);
    //res.send(body);
  });


  setTimeout(function(){
    rst = rst.result;
    //res.send(rst);
    var lst = []
    for (var i = 0; i < rst.count; i++){
      lst.push([rst.station[i].stationName, rst.station[i].x, rst.station[i].y]);
    }
    res.send(lst);
  }, 500);
});
app.get('/map', function(req, res){
  res.sendFile(__dirname + '/source/map.html');
});

app.get('/1', function(req, res){
  while (queryx.length > 1){
    queryx.pop();
    queryy.pop();
  }
  res.sendFile(__dirname + '/source/page_1.html');
});

app.get('/2', function(req, res){
  while (queryx.length > 2){
    queryx.pop();
    queryy.pop();
  }
  res.sendFile(__dirname + '/source/page_2.html');
});

app.post('/', function(req, res){

  queryx.push(req.body.x);
  queryy.push(req.body.y);
  res.redirect('/1');
});

app.post('/1', function(req, res){
  queryx.push(req.body.x);
  queryy.push(req.body.y);
  res.redirect('/2');
});

app.post('/2', function (req, res) {
  queryx.push(req.body.x);
  queryy.push(req.body.y);
  res.redirect('/result');
});

app.listen(3000,function(){
  console.log(`Server is running!`);
});

var express = require('express');
var bp = require('body-parser');
var rqst = require('request');
var odysaykey = 'atfxVlgusoHTkxTFXa%2FlajJwZ%2B5qeO9sqHe%2FpOMkpBk';
var app = express();

var queryx = [], queryy = [];
var xvg, yvg;

//var client_id = 'HidmRTMmZoMwdG4DJAPw';
//var client_secret = 'A3VqfyXvR1';
app.set("view engine", "ejs");
app.set("views", __dirname + "/source");
app.use(express.static('source'));
app.use(bp.urlencoded({ extended : false }));
app.get('/', function (req, res){
  while (queryx.length > 0){
    queryx.pop();
    queryy.pop();
  }
  xvg = 0;
  yvg = 0;
  res.render('page_1');
});

app.get('/result', function (req, res) {
  for (var i = 0; i < queryx.length; i++){
    xvg += queryx[i];
    yvg += queryy[i];
  }
  xvg /= queryx.length;
  yvg /= queryy.length;
  //xvg = 126.9670558;
  //yvg = 37.5428137;
  var rst;
  rqst(`https://api.odsay.com/v1/api/pointSearch?lang=0&x=${xvg}&y=${yvg}&radius=1000&stationClass=2&apiKey=${odysaykey}`, function(err, response, body){
    rst = JSON.parse(body);
  });


  setTimeout(function(){
    rst = rst.result;
    console.log(rst);
    if (!rst){
      res.end("Error");
    }
    var lst = []
    for (var i = 0; i < rst.count; i++){
      lst.push([rst.station[i].x, rst.station[i].y+0.0002]);
    }
    //res.send(lst);
    console.log(lst);
    output = {
      xvg : xvg,
      yvg : yvg,
      queryx : queryx,
      queryy : queryy,
      lst : lst
    };
    console.log(output);
    res.render('result', output);
  }, 500);
});
app.get('/map', function(req, res){
  res.render('map');
});

app.get('/1', function(req, res){
  while (queryx.length > 1){
    queryx.pop();
    queryy.pop();
  }
  res.render('page_2');
});

app.get('/2', function(req, res){
  while (queryx.length > 2){
    queryx.pop();
    queryy.pop();
  }
  res.render('page_3');
});

app.post('/', function(req, res){
  queryx.push(req.body.x*1);
  queryy.push(req.body.y*1);
  res.redirect('/1');
});

app.post('/1', function(req, res){
  queryx.push(req.body.x*1);
  queryy.push(req.body.y*1);
  res.redirect('/2');
});

app.post('/2', function (req, res) {
  queryx.push(req.body.x*1);
  queryy.push(req.body.y*1);
  res.redirect('/result');
});

app.listen(3389,function(){
  console.log(`Server is running!`);
});

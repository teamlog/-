var express = require('express');
var bp = require('body-parser');
var rqst = require('request');
var odysaykey = 'atfxVlgusoHTkxTFXa%2FlajJwZ%2B5qeO9sqHe%2FpOMkpBk';
var app = express();
//var client_id = 'HidmRTMmZoMwdG4DJAPw';
//var client_secret = 'A3VqfyXvR1';
app.use(express.static('source'));
app.use(bp.urlencoded({ extended : false }));
app.get('/', function (req, res){
  res.sendFile(__dirname + `/source/post.html`);
})
app.get('/map', function(req, res){
  res.sendFile(__dirname + '/source/map.html');
})
app.post('/', function (req, res) {
  var qryx = [req.body.query1x*1, req.body.query2x*1, req.body.query3x*1];
  var qryy = [req.body.query1y*1, req.body.query2y*1, req.body.query3y*1];
  var xvg = 0, yvg = 0;
  for (var i = 0; i < qryx.length; i++){
    xvg += qryx[i];
    yvg += qryy[i];
  }
  xvg /= qryx.length;
  yvg /= qryy.length;
  xvg = 126.9670558;
  yvg = 37.5428137;
  var rst;
  rqst(`https://api.odsay.com/v1/api/pointSearch?lang=0&x=${xvg}&y=${yvg}&radius=600&stationClass=2&apiKey=${odysaykey}`, function(err, response, body){
    rst = JSON.parse(body);
    //res.send(body);
  });
  setTimeout(function(){
    console.log(rst);
    rst = rst.result;
    //res.send(rst);
    var lst = []
    for (var i = 0; i < rst.count; i++){
      lst.push([rst.station[i].stationName, rst.station[i].x, rst.station[i].y]);
    }
    res.send(lst);
  }, 500);
});
app.listen(3000,function(){
  console.log(`Server is running!`);
})

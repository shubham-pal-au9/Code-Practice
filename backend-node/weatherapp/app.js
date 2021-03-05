var express = require('express');
var request = require('request');
var port = process.env.PORT || 6700;
var app = express();

app.get('/weather',(req,res) => { 
    var apiUrl = " ";
    request(apiUrl,(err,data) => {
        if(err) throw err;
        res.send(data.body)
    })

})

app.listen(port,(err) => {
    if(err) throw err;
    console.log('Server is running on port ${port}')
})



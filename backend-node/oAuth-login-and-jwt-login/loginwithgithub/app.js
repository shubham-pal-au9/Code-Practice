const express = require('express');
const app = express();
const superagent = require('superagent');
const request = require('request');
const port = 7800;

app.set('view engine','ejs');

app.get('/',(req,res) => {
    res.render('pages/login.ejs')
})

app.get('/profile',(req,res) => {
    const code = req.query.code;
    if(!code){
        res.send({
            success:false,
            message:'Error on access'
        })
    }
    superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id:'100cc18d754140bbced1' ,
            client_secret:'7d4ae1d52ca894890ee0afc17309c63cc1a0b23d',
            code:code
        })
        .set('Accept','application/json')
        .end((err,result)=>{
            if(err) throw err;
            var accesstoken = result.body.access_token;
            var option = {
                url:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Authorization':'token '+accesstoken,
                    'User-Agent':"mycode"
                }
            }
            request(option,(err,response,body) => {
                return res.send(body)
            })
        })
})


app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../modal/userModal');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())

//getAll User
router.get('/users',(req,res) => {
    User.find({},{password:0},(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//register
router.post('/register',(req,res)=>{
    var hashedpassword = bcrypt.hashSync(req.body.password,8);
    User.create({
        name:req.body.name,
        password:hashedpassword,
        email:req.body.email,
        role:req.body.role?req.body.role:'user'
    },(err,user) => {
        if(err) return res.status(500).send('Error')
        res.status(200).send("Register Success")
    })
})

//loginUser
 router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,data) => {
        if(err) return res.status(500).send({auth:false, "error":'Error While login'})
        if(!data) return res.status(500).send({auth:false, "error":'No user Found Register First'})
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,data.password)
            if(!passIsValid) return res.status(500).send({"error":'Invalid Password'})

            //here we are generating token
            //userid,secert,expiretime
            var token = jwt.sign({id:data._id},config.secert,{expiresIn:86400});
            res.send({auth:true,token:token})
        }
    })
});

//profile
router.get('/userInfo',(req,res) => {
    var token = req.headers['x-access-token'];
    if(!token) res.send({auth:false,token:'No Token Provided'})
    jwt.verify(token,config.secert,(err,data) => {
        if(err) return res.status(500).send({auth:false, "error":'Invalid Token'})
        User.findById(data.id,{password:0},(err,result) => {
            res.send(result)
        })
    })
})


module.exports = router;

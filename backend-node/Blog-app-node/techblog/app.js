const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const session = require('express-session');
const url = "mongodb://localhost:27017";
const port = process.env.PORT || 6700;
//make object of express so that we can use methods
let app = express();
let dbobj;
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


///use session
app.use(session({
    secret:'78367326576738'
}));

//static path
app.use(express.static(__dirname+'/public'));
//html
app.set('views','./src/views');
//view engine
app.set('view engine','ejs');


//we connect with mongo
var mongoClient = new mongodb.MongoClient(url);
mongoClient.connect((err) => {
    if(err) throw err;
    dbobj = mongoClient.db('aryablog')
});

const postRouter = require('./src/Routes/postRoutes')(dbobj);

app.get('/health',(req,res) => {
    res.send("Health Ok")
})

app.get('/',(req,res) => {
    let errmessage = req.query.errmessage?req.query.errmessage:'';
    let successmessage = req.query.sucmessage?req.query.sucmessage:'';
    res.render('login',{errmessage:errmessage,successmessage:successmessage})
})

app.get('/register',(req,res) => {
    let errmessage = req.query.errmessage?req.query.errmessage:'';
    res.render('register',{errmessage:errmessage})
})

//Register User
app.post('/register',(req,res) => {
    let user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role?req.body.role:'user',
        isActive:true
    }
    dbobj.collection('users').findOne({email:user.email},(err,data) => {
        if(data){
            return res.redirect("/register?errmessage=Email Already Taken Added")  
        }else{
            dbobj.collection('users').insert(user,(err,data)=>{
                if(err) throw err;
                //return res.send("Data Added")
                res.redirect("/?sucmessage=Successfully Register")  
            })
        }
    })
});

postRouter.route('/edit/:id')
    .get((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }
        let Id = mongodb.ObjectID(req.params.id);
        dbobj.collection('posts').findOne({_id:Id,isActive:true},(err,data) => {
            console.log("edit data>>>",data)
            res.render('edit',{data,userdata:req.session.user})
        })
    })

// Comments
app.post('/comments/:id',(req,res) => {
    let Id = mongodb.ObjectID(req.params.id);
    let comment = {
        _id:Id,
        comments:req.body.textarea
    }
    console.log(comment)
    dbobj.collection('comments').findOne({comments:comment._id},(err,data) => {
        if(data){
            return res.redirect("/post")  
        }else{
            dbobj.collection('comments').insert(comment,(err,data)=>{
                if(err) throw err;
                //return res.send("Data Added")
                res.redirect("/post") 
            })
        }
    })
});

// get comments data

app.get('/commentsdata',(req,res) => {
    console.log("session>>>",req.session)
    if(!req.session.user){
        return res.redirect('/?errmessage=No Session Found! Please Login Again')
    }
    dbobj.collection('comments').find().toArray((err,data)=>{
           return res.send(data)
          //res.render('comments',{data:data,userdata:req.session.user}) 
    })
});

//editUser
app.put('/edituser',(req,res) => {
    console.log(req.body)
    let status;
    if(req.body.isActive){
        if(req.body.isActive=='true'){
            status=true
        }else{
            status=false
        }
    }else{
        status=false
    }

    dbobj.collection('users').update(
        {_id:mongodb.ObjectID(req.body._id)},
        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                role:req.body.role?req.body.role:'user',
                isActive:status
            }
        },(err,result) =>{
            if(err) throw err;
            res.send('Data Updates')
        }
    )
});

//login
app.post('/login',(req,res) => {
    let user={
        email:req.body.email,
        password:req.body.password
    }
 
    dbobj.collection('users').findOne(user,(err,data) => {
        if(err || !data){
            return res.redirect('/?errmessage=Invalid Login! Please Try Again')
        }else{
            //save data in session
            /*if(req.session.user.email = data.email){
                
            }*/
            req.session.user = data;
            console.log(req.session.user)
            console.log("login>>>",req.session)
            //return res.send(data)
            res.redirect('/post')
        }
    })
})


//all users
app.get('/allUsers',(req,res) => {
    console.log("session>>>",req.session)
    if(!req.session.user){
        return res.redirect('/?errmessage=No Session Found! Please Login Again')
    }
    if(req.session.user.role !=="Admin" && req.session.user){
        return res.redirect('/post?errmessage=You are Not Admin')
    }
    dbobj.collection('users').find().toArray((err,data)=>{
        //return res.send(data)
        res.render('users',{data:data,userdata:req.session.user})
    })
});

//usersbyid
app.get('/userbyid',(req,res) => {
    console.log("session>>>",req.session)
    if(!req.session.user){
        return res.redirect('/?errmessage=No Session Found! Please Login Again')
    }
    if(req.session.user.role !=="Admin" && req.session.user){
        return res.redirect('/post?errmessage=You are Not Admin')
    }
    let query ={}
    if(req.query.id){
        query={_id:mongodb.ObjectID(req.query.id)}
    }
    dbobj.collection('users').findOne(query,(err,data)=>{
        return res.send(data)
    })
});


//logout
app.get('/logout',(req,res) => {
    req.session.user = null;
   //return res.send('Logout Success')
   res.redirect('/')
})

//model of post
app.use('/post',postRouter);

app.listen(port,(err) => {
    if(err) throw err;
    console.log(`App is running on port ${port}`)
})
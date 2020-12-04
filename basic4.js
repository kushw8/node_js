var express = require("express");
const app = express();
var mysql = require("mysql");

var bodyparser = require('body-parser');


var connection = mysql.createConnection({
    host :"localhost",
    user: "root",
    password:"",
    database: 'userreview'
});



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.post('/register',(req,res,next)=>{
  
    var data = req.body;
    var password = data.password;
    var email = data.email;

    connection.query("SELECT * FROM user_info WHERE email = ?",[email],function(err,result,fields){

        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });

    
    if(result && result.length){
        res.json("user already exists");
    }else{
        var insert_cmd = "INSERT INTO user_info (email,password) values (?,?)";
        var values = [email,password];

         console.log("executing :"+insert_cmd);
         connection.query(insert_cmd,values,(err,results,fields)=>{
             connection.on('err',(err)=>{
                console.log("[MYSQL ERROR]",err);
             });
             res.json("Registered!");
             console.log("Registered Successful");
         });
        }
});

});

app.post('/login',(req,res,next)=>{
  
    var data = req.body;
    var email = data.email;
    var password = data.password;
   
    connection.query("SELECT * FROM user_info WHERE email = ?",[email], function(err,result,fields){
    
        connection.on('error' ,(err)=>{
            console.log("[MYSQL ERROR]",err);
        });

        if(result&&result.length){
            console.log(result);

            if(password==result[0].password){
                res.json("user logged in");
                res.end;
            }else{
                res.json("wrong password");
                res.end;
            }
        }
        else{
            res.json("user not found");
            res.end;
        }
    });     



});

var server = app.listen(3001,()=>{
    console.log("Register running at http://localhost:3000");
});

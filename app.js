var express=require('express');
var app=express();
var bodyParser = require("body-parser");
//var JSAlert = require("js-alert");
var mysql = require('mysql');
var bodyParser=require("body-parser");

// Chat feature
const server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var users = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', data => {
    socket.broadcast.emit('chat-message', { message: data.message, name: users[socket.id],
    selectedType: data.selectedType})
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
// Chat feature ends
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('static'));

//var popup = require('popups');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vvrushab',  //your username
  password: 'flashship@123',
  database : 'flashship',
  multipleStatements: true
  //the name of your db
});

var status;
var id;

app.get("/",function(req,res){
    
res.render('landing');
});    
app.get("/track/:id",function(req,res){
var packageid= req.params.id; 

   connection.query('SELECT * FROM package where packageid = ? ',[packageid], function (error, results, fields) {
      
       Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const date = new Date(results[0].date_of_order);


       var result = {
        pid : packageid,
        product : results[0].product,
        amount : results[0].amount,
        date_of_delivery : String(date).substring(4,15),
        date_of_order : String(results[0].date_of_order).substring(4,15),
        source : results[0].source,
        destination : results[0].destination
        
        
       }
    
        res.render('track',{result:result});
    });
});  
app.post("/orderlanding",function(req,res){
var packageid= req.body.id; 

   connection.query('SELECT * FROM package where packageid = ? ',[packageid], function (error, results, fields) {
     if(results!=[]){ 
         console.log(results)
       Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const date = new Date(results[0].date_of_order);


       var result = {
        pid : packageid,
        product : results[0].product,
        amount : results[0].amount,
        date_of_delivery : String(date).substring(4,15),
      
        source : results[0].source,
        destination : results[0].destination
        
        
       }
    
        res.render('orderlanding',{result:result});
     }
     else{
         var status='swal("Package ID Dosenot Exist","Try Again","error",{button:"Try Again",})';
         res.render("landing",{status:status})
     }
    });
}); 

app.get("/login",function(req,res){
    
res.render('login',{status:""});
});
//app.get("/loggedin",function(req,res){
  //  res.render("loggedin",{status:""});
//});
app.get("/contact",function(req,res){
    res.render("contact");
});

app.get("/order",function(req,res){
    
res.render('order');
}); 
app.get("/ordered",function(req,res){
    
res.render('userview');
});

// Chat feature
app.get("/userchat", (req, res) => {
   res.render('userchat'); 
});
app.get("/driverchat", (req, res) => {
   res.render('driverchat'); 
});
app.get("/adminchat", (req, res) => {
   res.render('adminchat'); 
});
// Chat feature ends
app.get("/orderdetails",function(req,res){
    connection.query('SELECT * FROM package where uid = ? ',[id], function (error, results, fields) {
      
        res.render('orderdetails',{res:results});
    });
    

}); 

app.get("/deliveries",function(req,res){
     connection.query('SELECT user.first_name,user.last_name,user.p_no, package.packageid, package.product,package.amount, package.destination FROM package inner join driver on package.packageid = driver.packageid inner join user on user.uid = package.uid where driver.uid = ? ',[id], function (error, results, fields) {
                
                var status='swal("Welcome","Driver Login successful","success",{button:"Proceed",})';
            res.render("driverview",{res:results})
               });
    

}); 
app.get("/adminstats",function(req,res){
     connection.query('SELECT sum(package.amount) as sum, count(packageid)*7 as count, count(packageid) as orders   FROM  package', function (error, results, fields) {
        console.log(results)
            res.render("adminstats",{res:results})
               });
    

});
app.get("/statsuser",function(req,res){
     connection.query('SELECT sum(package.amount) as sum, count(packageid) as orders   FROM  package where uid = ?',[id], function (error, results, fields) {
         console.log(id)
            res.render("userstats",{res:results})
               });
    

});
app.get("/assigneddrivers",function(req,res){
    connection.query('SELECT driver.uid, package.packageid, user.first_name, user.last_name, user.p_no FROM package inner join driver on package.packageid = driver.packageid inner join user on driver.uid = user.uid ', function (error, results, fields) {
      
        res.render('assigneddrivers',{res:results});
    });
    

}); 

app.get("/assign",function(req,res){
   connection.query('SELECT * FROM user inner join login on user.uid = login.uid where login.is_category = "driver"', function (error, resdriver, fields) {
                 connection.query('SELECT packageid FROM package where packageid NOT IN  (select packageid from driver)', function (error, assign, fields) {
                     
                    var result = {
                        res : resdriver,
                        assign : assign
                    }
               
                    res.render("assign",{result:result})
                 });
                   });

}); 

//USER AUTHENTICATION

app.post("/loggedin",function(req,res){

var email= req.body.email;
  var password = req.body.password;
  var is_category=req.body.is_category;
  connection.query('SELECT * FROM user inner join login on user.uid = login.uid WHERE login.email =? ',[email], function (error, results, fields) {
      id = results[0].uid
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    });
  }
  else if(results.length >0){
      if(results[0].password == password)
    {   
        if(is_category==results[0].is_category)
        {
            if(results[0].is_category=="user")
            {
     
                var status='swal("Welcome","You are now logged in!","success")' 
             res.render("userview",{status:status});
            }
        else if(results[0].is_category=="admin")
            {
            connection.query('SELECT * FROM user inner join login on user.uid = login.uid where login.is_category = "driver"', function (error, resdriver, fields) {
                 connection.query('SELECT * FROM package ', function (error, package_details, fields) {
                     
                    var result = {
                        res : resdriver,
                        package_details : package_details
                    }
                    
                  console.log(result.package_deails)
                    res.render("adminview",{result:result})
                 });
                   });
                   } 
           else if(results[0].is_category=="driver")
            {
             res.redirect("/deliveries")
            } 
        }
        
        else
        {
        var status='swal("Invalid Login details","Wrong user or admin type selected","error",{button:"Try Again",})';
         res.render("login",{status:status})
        }
            
        }
      else{
          var status = 'swal("Check Again", "The Email/password you have entered is incorrect","error",{button:"Try Again",})' ;
        res.render("login",{status:status})
          }
    }
    else{
        var status='swal("Sorry!","User not found","error",{button:"Try Again",})';
    res.render("login",{status : status})
    
           
    }
  
  });

});

app.post('/saveMessage', function(req, res) {
    console.log('inside savemessage');
    var messageBody = {
        message: req.body.message
    };
    connection.query('INSERT INTO chat SET ?', messageBody, function(err, results) {
    if(err) {
     console.log(err);
    }
   });
});


app.post('/register', function(req,res){

 var userid;
 var person = {
     
     first_name: req.body.fname,
     last_name: req.body.lname,
     date_of_birth : req.body.dob,
     blood_group : req.body.bgo,
     address:req.body.address,
     gender : req.body.gen,
     p_no : req.body.pno,
  };

 
 connection.query('INSERT INTO user SET ?', person, function(err, results) {
 if(err)
 {
     console.log(err);
 }

 
 });
 
 connection.query('SELECT uid from user ORDER BY uid DESC LIMIT 1',function(err,res2){

   if(err)
 {
     console.log(err);
 }
 userid=res2[0].uid;
id = userid


 var logger={
   uid:userid,
   is_category:"user",
   email:req.body.email,
   password:req.body.password
 };

connection.query('INSERT INTO login SET ?',logger,function(err,result5){
   if(err)
   {
       console.log(err);
   }
   else
   {     var status='swal("Done","Thank you for signing up","success")';
        
        res.render("login",{status : status})    
       
   }
});
});
});


app.get('/delete/:id', function(req, res, next) {
  var packageid= req.params.id;
    var sql = 'DELETE FROM package WHERE packageid = ?';
    connection.query(sql, [packageid], function (err, result) {
    if (err) throw err;
   
  });
  res.redirect('/orderdetails');
  
});

app.get('/cancel/:id', function(req, res, next) {
  var packageid= req.params.id;
    var sql = 'DELETE FROM package WHERE packageid = ?; delete from driver where packageid = ?';
    connection.query(sql, [packageid,packageid], function (err, result) {
    if (err) throw err;
   
  });
  res.redirect('/deliveries');
  
});

app.get('/delivered/:id', function(req, res, next) {
  var packageid= req.params.id;
    var sql = 'DELETE FROM package WHERE packageid = ?; delete from driver where packageid = ?';
    connection.query(sql, [packageid,packageid], function (err, result) {
    if (err) throw err;
   
  });
  res.redirect('/deliveries');
  
});
app.post('/assigned', function(req, res) {
 var values={
    uid : req.body.uid,
    packageid : req.body.package_selected
 };
console.log(values)
connection.query('INSERT INTO driver SET ?',values,function(err,result5){
   if(err)
   {
       console.log(err);
   }
   else
   {     var status='swal("Done","Package Assigned","success")';
        
        res.redirect('/assigneddrivers')   
       
   }
});
  
});


//closing of outer select query to not lose scope of userid
app.post('/ordered', function(req,res){
   
    let date_ob = new Date();

// current date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

var current_date = year + "-" + month + "-" + date;
var current_time = hours + ":" + minutes + ":" + seconds
  var amt;
    if(req.body.weight >20 && req.body.distance >20 ) {
         amt = req.body.weight*10+req.body.distance*10
    }
     if(req.body.weight >20 && req.body.distance <20 ) {
         amt = req.body.weight*10+req.body.distance*12
    }
     if(req.body.weight <20 && req.body.distance >20 ) {
         amt = req.body.weight*12+req.body.distance*10
    }
     if(req.body.weight <20 && req.body.distance <20 ) {
         amt = req.body.weight*12+req.body.distance*12
    }

            var packagedetails=
            {   
              uid:id,        
              product : req.body.pkgname,
              destination: req.body.destination,
              amount : amt,
              date_of_order: current_date,
              time_of_order : current_time,
              source : req.body.source,
              
    
            };
            
  
connection.query('INSERT INTO package SET ?',packagedetails,function(err,result5){
   if(err)
   {
       console.log(err);
   }
   else
   {     var status='swal("Done","Thank you for Ordering","success")';
        
        res.render("userview",{status : status})    
       
   }
});
            
        
    });  

// app.listen(8080,function()
// {
//   console.log("Server running on 8080!");
// });

// Chat feature

server.listen(8080, () => {
   console.log("Server running on 8080!");
});

// Chat feature ends
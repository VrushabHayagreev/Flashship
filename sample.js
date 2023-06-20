var faker = require('faker');


var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'darshan7575',  //your username
  database : 'vrushab'         //the name of your db
});
var date=[];

var data = [];
{
    data.push([
       
        1,'Maruti',200,"2000-10-10"
  
    ]);
}

var q = 'INSERT INTO vehicle VALUES ?';

connection.query(q, [data], function(err, result) {
  console.log(err);
  console.log(result);
});

connection.end();
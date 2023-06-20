CREATE TABLE user (
uid int NOT NULL auto_increment,

first_name varchar(50) NOT NULL,
last_name varchar(50) NOT NULL,
gender varchar(100) NOT NULL,
address varchar(100) NOT NULL,
date_of_birth date NOT NULL,
blood_group varchar(3) NOT NULL,
p_no varchar(50) NOT NULL unique,
PRIMARY KEY (uid)
);

insert into user values('3','abcd','g','M','800 N smith rd apt D2','1998-08-31','O+',9302153122)
insert into user(email,first_name,last_name,gender,address,date_of_birth,blood_group,p_no) values('supuli@iu.edu','sumukha','pulipak','M','800 N smith rd apt D2','1998-08-31','O+',1234567880)
insert into user(email,first_name,last_name,gender,address,date_of_birth,blood_group,p_no) values('abcd@iu.edu','abcd','efgh','M','800 N smith rd apt D2','1998-08-31','O+',1234567890)



CREATE TABLE login (
    uid int NOT NULL PRIMARY KEY,
    email varchar(50) unique,
	password varchar(50) NOT NULL,
    is_category varchar(10) DEFAULT 'user',
    FOREIGN KEY (uid) REFERENCES user(uid)
);
'vvrushab@iu.edu'
insert into login values (1,'vvrushab@iu.edu','flashship@123','admin')

CREATE TABLE contact (
    uid int NOT NULL PRIMARY KEY,
    name varchar(50) NOT NULL,
  description varchar(50) NOT NULL,
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE package (
    uid int NOT NULL,
    packageid int NOT NULL PRIMARY KEY auto_increment,
    product varchar(50) NOT NULL,
    amount int NOT NULL,
    date_of_order date NOT NULL,
    time_of_order time NOT NULL,
    source varchar(50) NOT NULL,
    Destination varchar(50) NOT NULL,
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE delivery (
    uid int NOT NULL PRIMARY KEY,
    location varchar(100) NOT NULL,
    vehicle_number varchar(10) NOT NULL,
    vehicle_size varchar(10) NOT NULL,
    no_delivery int,
    packageid int,
    latitude int,
    longitude int,
  
    FOREIGN KEY (packageid) REFERENCES package(packageid)
);

CREATE TABLE driver (
    uid int NOT NULL PRIMARY KEY,
    packageid int NOT NULL,
    FOREIGN KEY (uid) REFERENCES user(uid)
);
var sql = require("./db");
const path = require("path");
const csv = require("csvtojson");

//create tables
const createUsersTable = (req,res,next)=>{
    var Q1 = "CREATE TABLE IF NOT EXISTS users (email varchar(255) PRIMARY KEY, name VARCHAR(255) not null, user_name VARCHAR(255) not null, age int not null, about_me text, phone_number varchar(10) not null, password varchar(15) not null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q1,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating users table"});
            return;
        }
        console.log('users table created successfully');
        return;
    })
    next();
};

const createTripsTable = (req,res,next)=>{
    var Q2 = "CREATE TABLE IF NOT EXISTS trips (trip_id int auto_increment primary key, owner_email varchar(255) not null, trip_date date not null, description text, dog_name varchar(255) not null, price int not null, address varchar(255) not null, start_time varchar(5) not null, end_time varchar(5) not null, img_path varchar(255), trip_status ENUM('approved', 'pending', 'canceled') not null, constraint fk_useremail foreign key (owner_email) references users(email)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q2,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating trips table"});
            return;
        }
        console.log('trips table created successfully');
        return;
    })
    next();
};

const createTripsRequestsTable = (req,res)=>{
    var Q3 = "CREATE TABLE IF NOT EXISTS trips_requests (trip_id int not null, requested_by varchar(255) not null, request_status ENUM('approved', 'rejected', 'pending') not null, primary key (trip_id, requested_by), constraint fk_email foreign key (requested_by) references users(email), constraint fk_tripID foreign key (trip_id) references trips(trip_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q3,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating trips requests table"});
            return;
        }
        console.log('trips requests table created successfully');
        res.send("all tables created");
        return;
    })
};


//insert
const InsertUsersData = (req,res)=>{
    var Q4 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "users.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var aboutMe = null;
        if (element.about_me != ""){
            aboutMe = element.about_me;
        }
        var NewEntry = {
            "email": element.email,
            "name": element.name,
            "user_name": element.user_name,
            "age": element.age,
            "about_me": aboutMe,
            "phone_number": element.phone_number,
            "password": element.password
        }
        sql.query(Q4, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row successfully");
        });
    });
    });
    res.send("users data inserted");
};

const InsertTripsData = (req,res)=>{
    var Q5 = "INSERT INTO trips SET ?";
    const csvFilePath= path.join(__dirname, "trips.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var description_input = null;
        var img_input = null;
        if (element.description != ""){
            description_input = element.description;
        }
        if (element.img_path != ""){
            img_input = element.img_path;
        }
        var NewEntry = {
            "owner_email": element.owner_email,
            "trip_date": element.trip_date,
            "description": description_input,
            "dog_name": element.dog_name,
            "price": element.price,
            "address": element.address,
            "start_time": element.start_time,
            "end_time": element.end_time,
            "img_path": img_input,
            "trip_status": element.trip_status

        }
        sql.query(Q5, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row successfully");
        });
    });
    });
    res.send("trips data inserted");
};


//insert trips requests data
const InsertRequestsData = (req,res)=>{
    var Q6 = "INSERT INTO trips_requests SET ?";
    const csvFilePath= path.join(__dirname, "trips_requests.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewEntry = {
            "trip_id": element.trip_id,
            "requested_by": element.requested_by,
            "request_status": element.request_status
        }
        sql.query(Q6, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row successfully");
        });
    });
    });
    res.send("trips data inserted");
};


//drop tables
const dropRequestsTable = (req,res, next)=>{
    var Q7 = "DROP TABLE trips_requests";
    sql.query(Q7, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping trips_requests table ", err);
            res.status(400).send({message: "error in dropping trips_requests table" + err});
            return;
        }
        console.log("trips_requests table dropped");
        return;
    });
    next();
};

const dropTripsTable = (req,res,next)=>{
    var Q8 = "DROP TABLE trips";
    sql.query(Q8, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping trips table ", err);
            res.status(400).send({message: "error in dropping trips table" + err});
            return;
        }
        console.log("trips table dropped");
        return;
    });
    next();
};

const dropUsersTable = (req,res)=>{
    var Q9 = "DROP TABLE users";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        res.send("all tables dropped");
        return;
    });
};


module.exports={createUsersTable, createTripsTable, createTripsRequestsTable, InsertUsersData, InsertTripsData, InsertRequestsData, dropRequestsTable, dropTripsTable, dropUsersTable};
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const csv = require("csvtojson");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const sql = require('./db/db');
const CRUD = require("./db/CRUD");
const CRUDdb = require("./db/CRUDdb");
const projectJS = require("./static/js/projectJS");
const port = 3000;

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload());

//for pug
app.set('views', path.join(__dirname, 'views'));//dirname is the folder which index.js exists in
app.set('view engine', 'pug');


//routes
app.get('/', (req, res) => {
    res.redirect('/main');
});

app.get('/main', (req, res) => {
    res.render('main');
});

app.get('/login',  (req, res) => {
    res.render('login', {
        title: 'login',
        header_text: 'LogIn'
    });
});

app.get('/signUp',  (req, res) => {
    res.render('signUp', {
        title: 'Sign Up',
        header_text: 'Sign Up'
    });
});

app.get('/newTrip',  (req, res) => {
    res.render('newTrip', {
        title: 'New Trip',
        header_text: 'Hi! Please sign a trip form:'
    });
});


app.post('/checkNewTrip', (req,res) => {
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var trip_details = "";
    var checkDescription = "";
    var description = req.body.descriptioninput;
    var checkDogName = projectJS.onlyLettersAndSpaces(req.body.dogName);
    if (req.body.descriptioninput != "") {
        checkDescription = projectJS.validateTextInput(req.body.descriptioninput);
    } else {
        description = null;
    }
    if (!req.files) {
        trip_details = {
            "owner_email": userEmail,
            "trip_date": req.body.dateinput,
            "description": description,
            "dog_name": req.body.dogName,
            "price": req.body.priceinput,
            "address": req.body.addressinput,
            "start_time": req.body.beginput,
            "end_time": req.body.endinput,
            "img_path": null,
            "trip_status": "pending"
        }
        console.log("trip_details", trip_details);
        if (checkDescription == "" && checkDogName == "") {
            sql.query("INSERT INTO trips SET ?", trip_details, (err, mysqlres) => {
                if (err) {
                    res.status(400).send({message: "error in creating row: " + err });
                    return;
                }
                res.render('ChooseOption', {
                    msg: "The trip was created successfully!"
                })
                return;
            });
        } else {
            res.render('newTrip', {
                title: 'New Trip',
                header_text: 'Hi! Please sign a trip form:',
                tripDetails: trip_details,
                dogName_err: checkDogName,
                description_err: checkDescription
            });
            return;
        }

    }
    else {
        var img_input = req.files.dogImg;
        var imgPath = userEmail + "_" + img_input.name;
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        const file_extension = img_input.name.slice(((img_input.name.lastIndexOf('.') - 1) >>> 0) + 2);
        // console.log("check end:", file_extension);
        trip_details = {
            "owner_email": userEmail,
            "trip_date": req.body.dateinput,
            "description": description,
            "dog_name": req.body.dogName,
            "price": req.body.priceinput,
            "address": req.body.addressinput,
            "start_time": req.body.beginput,
            "end_time": req.body.endinput,
            "img_path": imgPath,
            "trip_status": "pending"
        }
        console.log("trip_details", trip_details);
        if (!array_of_allowed_files.includes(file_extension)) {
            res.render('newTrip', {
                title: 'New Trip',
                header_text: 'Hi! Please sign a trip form:',
                tripDetails: trip_details,
                dogName_err: checkDogName,
                description_err: checkDescription, 
                img_err: "Invalid file type, please select image file type"
            });
            return;
        } else {
            sql.query("select * from trips where img_path = ?", imgPath, (err, mysqlres2) => {
                if (err) {
                    res.status(400).send({message: "error in select img row: " + err + imgPath});
                    return;
                }
                if (mysqlres2.length != 0) {
                    res.render('newTrip', {
                        title: 'New Trip',
                        header_text: 'Hi! Please sign a trip form:',
                        tripDetails: trip_details,
                        dogName_err: checkDogName,
                        description_err: checkDescription, 
                        img_err: "You have already uploaded an image with the same name, try again"
                    });
                    return;
                } else {
                    if (checkDogName == "" && checkDescription == "") {
                        img_input.mv(__dirname + '/static/images/uploads/' + imgPath);
                        sql.query("INSERT INTO trips SET ?", trip_details, (err, mysqlres3) => {
                            if (err) {
                                res.status(400).send({message: "error in creating row: " + err + imgPath});
                                return;
                            }
                            res.render('ChooseOption', {
                                msg: "The trip was created successfully!"
                            });
                            return;
                        });
                    }
                    else {
                        res.render('newTrip', {
                            title: 'New Trip',
                            header_text: 'Hi! Please sign a trip form:',
                            tripDetails: trip_details,
                            dogName_err: checkDogName,
                            description_err: checkDescription
                        });
                        return;
                    }
                }
            })
        }
    }
});

// mytrips route
app.get('/myTrips', CRUD.getMyTrips);

// availableTrips route
app.get('/availableTrips', CRUD.getAvailableTrips);

app.get('/ChooseOption', (req, res) => {
    res.render('ChooseOption');
});

////
app.post('/checkLogin', CRUD.checkLoginInputs);

app.post('/checkSignUp', CRUD.SignUpCheck);


//cookies
app.get("/setEmailCookie/:email", (req, res) => {
    var userEmail = req.params.email;
    res.cookie('userEmail', userEmail);
    res.redirect('/ChooseOption');
});

app.get('/removeTrip/:id', CRUD.removeTrip);



////////// initialize db //////////

//route to create all DB tables
app.get('/createDBtables', [CRUDdb.createUsersTable, CRUDdb.createTripsTable, CRUDdb.createTripsRequestsTable]);
//route to insert users data
app.get('/insertUsersData', CRUDdb.InsertUsersData);
//route to insert trips data
app.get('/insertTripsData', CRUDdb.InsertTripsData);
//route to insert requests trips data
app.get('/insertRequestsData', CRUDdb.InsertRequestsData);
//route to all DB tables
app.get('/dropDBtables', [CRUDdb.dropRequestsTable, CRUDdb.dropTripsTable, CRUDdb.dropUsersTable]);

//listen
app.listen(port, ()=>{
    console.log("express server is running on port "+ port);
});
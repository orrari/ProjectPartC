var sql = require("./db");
const projectJS = require("../static/js/projectJS");

const checkLoginInputs = (req, res)=>{
    console.log("insert");
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const loginInputs = {
        "user_name": req.body.usernameinput,
        "password": req.body.passwordinput
    };
    sql.query("SELECT email, user_name, password FROM users where user_name like ?", loginInputs.user_name + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        if (mysqlres.length == 0) {
            res.render('login', {
                title: 'login',
                header_text: 'LogIn',
                user_name: loginInputs.user_name,
                username_err: 'Username does not exist'
            });
            return;
        }
        else {
            if (mysqlres[0].password == loginInputs.password) {
                res.redirect("/setEmailCookie/" + mysqlres[0].email);
                return;
            } else {
                res.render('login', {
                    title: 'login',
                    header_text: 'LogIn',
                    user_name: loginInputs.user_name,
                    pass_err: 'Incorrect password, please try again'
                });
                return;
            }
        }
    });
};

const SignUpCheck = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var check_name = projectJS.onlyLettersAndSpaces(req.body.nameinput);
    var check_userName = projectJS.validateUsernameSpace(req.body.usernameinput);
    var check_pass = projectJS.validatePassword(req.body.passwordinput);
    var check_about_me = "";
    var newUser = "";
    if (req.body.descriptioninput != "") {
        check_about_me = projectJS.validateTextInput(req.body.descriptioninput);
        newUser = {
            "email": req.body.mailinput,
            "name": req.body.nameinput,
            "user_name": req.body.usernameinput,
            "age": req.body.ageinput,
            "about_me": req.body.descriptioninput,
            "phone_number": req.body.phoneinput,
            "password": req.body.passwordinput
        };
    } else {
        newUser = {
            "email": req.body.mailinput,
            "name": req.body.nameinput,
            "user_name": req.body.usernameinput,
            "age": req.body.ageinput,
            "about_me": null,
            "phone_number": req.body.phoneinput,
            "password": req.body.passwordinput
        };
    }

    sql.query("select * from users where email like ?", newUser.email + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }

        else if (mysqlres.length == 0) {
            sql.query("select * from users where user_name like ?", newUser.user_name + "%", (err, mysqlres2) =>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
                else if (mysqlres2.length == 0) {
                    if (check_name == "" && check_userName == "" && check_pass == "" && check_about_me == "") {
                        sql.query("INSERT INTO users SET ?", newUser, (err, mysqlres3) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({message: "error in create user: " + err + newUser});
                                return;
                            }
                            console.log("created user");
                            res.render('login', {
                                title: 'login',
                                header_text: 'LogIn',
                                msg: "You have successfully signed up to the site! Login"
                            });
                            return;
                        });
                    } else {
                        res.render('signUp', {
                            title: 'Sign Up',
                            header_text: 'Sign Up',
                            userDetails: newUser,
                            name_err: check_name,
                            description_err: check_about_me,
                            username_err: check_userName,
                            pass_err: check_pass
                        });
                        return;
                    }
                }
                else {
                    res.render('signUp', {
                        title: 'Sign Up',
                        header_text: 'Sign Up',
                        userDetails: newUser,
                        name_err: check_name,
                        description_err: check_about_me,
                        username_err: "This username already exists, please choose another username",
                        pass_err: check_pass

                    });
                    return;
                }
            })
        } else {
            res.render('signUp', {
                title: 'Sign Up',
                header_text: 'Sign Up',
                userDetails: newUser,
                name_err: check_name,
                description_err: check_about_me,
                username_err: check_userName,
                pass_err: check_pass,
                email_err: "This email is already in use, please choose another email"
            });
            return;
        }
})};

const getMyTrips = (req, res) => {
    var userEmail = req.cookies.userEmail;
    var query = "SELECT t.address, t.description, t.dog_name, t.end_time, t.img_path, t.price, t.start_time, t.trip_date, u.name as owner_name, u.phone_number as owner_phone FROM trips t INNER JOIN trips_requests r ON t.trip_id = r.trip_id INNER JOIN users u ON t.owner_email = u.email WHERE r.requested_by like ? AND request_status = 'approved';"
    sql.query(query, userEmail + "%",  (err, mysqlres) => {
        
        // Query error
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting my trips: ", err});
            return;
        }
        
        if (mysqlres.length != 0) {
            console.log(mysqlres);

            // No error in query, render template
            res.render('myTrips', {
                title: 'My Trips',
                header_text: 'MY TRIPS',
                trips: mysqlres
            });
        } else {
            // TODO: add empty content...
            console.log("no results found");
        }
        
        return;
    })
};


const getAvailableTrips = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    console.log("user email ", userEmail);
    
    var query = "select t.trip_id, t.owner_email, DATE_FORMAT(t.trip_date, '%d/%m/%Y') as trip_date, t.description, t.dog_name, t.price, t.address, t.start_time, t.end_time, t.img_path, t.trip_status, u.name as owner_name, u.phone_number as owner_phone, case when t.owner_email like ? then 1 else 0 end as is_owner from trips t join users u on t.owner_email = u.email where t.trip_date >= CURDATE() and t.trip_status = 'pending'"

    // Fetch data from database
    sql.query(query, userEmail + "%", (err, mysqlres) => {

        // Query error
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting trips: " + err});
            return;
        }

        // No error in query, render template
        console.log(mysqlres);
        res.render('availableTrips', {
                title: "AVAILABLE TRIPS",
                header_text: "AVAILABLE TRIPS",
                trips: mysqlres
        })
        return;
    });
};

const removeTrip = (req, res) => {
    var tripID = req.params.id;
    console.log(tripID);
    sql.query("DELETE FROM trips WHERE trip_id like ?", tripID + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        res.redirect('/availableTrips');
    });

};

module.exports = {checkLoginInputs, SignUpCheck, getMyTrips, getAvailableTrips, removeTrip};

//names validation
function onlyLettersAndSpaces(name) {
    var check = /^[A-Za-z\s]*$/.test(name);
    var res = "";
    if (!check) {
        res = "The name should contain only letters and spaces";
    }
    return res;
}

//text area validation
function validateTextInput(text_input) {
    var res = "";
    if(!isNaN(text_input)) {
        res = "It should also contain letters and not just numbers";
    }
    return res;
}

//user name validation
function validateUsernameSpace(username) {
    var res = "";
    var check = username.indexOf(" ") >= 0;
    if (check) {
        res = "Username should be without spaces";
    }
    return res;
}

//password validation
function validatePassword(pass){ 
    var res = "";
    var passw =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
    if(!pass.match(passw)){ 
      res = "A password must contain at least one number, an uppercase English letter, a lowercase English letter and between 8-15 characters";
    }
    return res;
}

function CheckD() {
    const date = new Date(document.getElementById('dateinput').value);
    const today = new Date();
    if (date.getTime() < today.getTime()) {
        alert("You can create a new trip for the next day and beyond");
        document.getElementById('dateinput').value = "";
    } else {
        return true;
    }
}


function enabledEndTime() {
    document.getElementById("endinput").disabled = false;
}

function CheckEndTime() {
    var startTime = document.getElementById("beginput").value;
    var endTime = document.getElementById("endinput").value;
    if (endTime < startTime) {
        document.getElementById("endinput").value = "";
        document.getElementById("end_time_err").innerHTML = "End time cannot be less than start time";
    }
    else {
        document.getElementById("end_time_err").innerHTML = "";
    }
}

function delete_trip_msg(trip_id) {
    var user_res = confirm("Are you sure you want to delete this trip?");
    if (user_res == true) {
      window.location.replace("http://localhost:3000/removeTrip/"+trip_id);
    }
    return;
}


module.exports = {validatePassword, validateUsernameSpace, validateTextInput, onlyLettersAndSpaces};
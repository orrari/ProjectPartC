function validateName(name) {
    const error = document.getElementById("error6")
    if (name.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"

        return false;
    } else {
        const letters = /^[A-Za-z\s]*$/;
        if (name.match(letters)) {
            error.textContent = ""
            return true;
        } else {
            error.textContent = 'this character is not match for name field (name)'
            error.style.color = "red"
            return false;
        }
    }
}

function validatePhone(num) {
    const error = document.getElementById("error5")
    if (num.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    } else {
        const numbers = /^[0-9\+\.]+$/;
        if (num.match(numbers)) {
            error.textContent = ""
            return true;
        } else {
            error.textContent = 'this character is not match for this field'
            error.style.color = "red"
            return false;
        }
    }
}

function validateEmail(email) {
    const error = document.getElementById("error3")
    if (email.length === 0) {
        error.textContent = "Oops! you need to type your email here"
        error.style.color = "red"
        return false;
    } else {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(validRegex)) {
            error.textContent = "Invalid email address"
            error.style.color = "red"
            return false;
        }
    }
    error.textContent = ""
    return true;
}

function validateAge(age) {
    const error = document.getElementById("error7")
    if (age.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    } else {
        const numbers = /^[0-9]+$/;
        if (age.match(numbers)) {
            error.textContent = ""
            return true;
        } else {
            error.textContent = 'this character is not match for this field'
            error.style.color = "red"
            return false;
        }
    }
}

const signUp = () => {
    const name = document.getElementById("nameinput").value;
    const errorMessage1 = validateName(name)
    if (errorMessage1 === "") {
        // validation succeeded
        console.log('name is:', name);
    }

    const age = document.getElementById("ageinput").value;
    const errorMessage2 = validateAge(age)
    if (errorMessage2 === "") {
        // validation succeeded
        console.log('age is:', age);
    }

    const email = document.getElementById("mailinput").value;
    const errorMessage3 = validateEmail(email)
    if (errorMessage3 === "") {
        // validation succeeded
        console.log('email is:', email);
    }

    const phone = document.getElementById("phoneinput").value;
    const errorMessage4 = validatePhone(phone)
    if (errorMessage4 === "") {
        // validation succeeded
        console.log('phone is:', phone);
    }

    const username = document.getElementById("usernameinput").value;
    const errorMessage6 = validateUsername(username)
    if (errorMessage6 === "") {
        // validation succeeded
        console.log('username is:', username);
    }

    const password = document.getElementById("passwordinput").value;
    const errorMessage7 = validatePassword(password)
    if (errorMessage7 === "") {
        // validation succeeded
        console.log('password is:', password);
    }

    if (errorMessage1 === true && errorMessage2 === true && errorMessage3 === true && errorMessage4 === true && errorMessage6 === true && errorMessage7 === true) {
        alert('You sign up successfully!');
        window.location = "../navigationPge/page4.html";
    }
}


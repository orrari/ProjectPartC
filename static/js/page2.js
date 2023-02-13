const validateUsername = (username) => {
    const error = document.getElementById("error1")
    if (username.length === 0) {
        error.textContent = "Hey, we need a username here"
        error.style.color = "red"
        return false;
    }
    const letters = /^[0-9a-zA-Z\_\.]+$/;
    if (!username.match(letters) || username.length < 8) {
        error.textContent = "your username must include at least 8 characters"
        error.style.color = "red"
        return false;
    }
    error.textContent = ""
    return true;
}

const validatePassword = (password) => {
    const error = document.getElementById("error2")
    if (password.length === 0) {
        error.textContent = "Hey, we need a password here"
        error.style.color = "red"
        return false;
    }
    const letters = /^[0-9a-zA-Z\_\.]+$/;
    if (!password.match(letters) || password.length < 8) {
        error.textContent = "your password must include at least 8 characters"
        error.style.color = "red"
        return false;
    }
    error.textContent = ""
    return true;
}

const login = () => {
    const username = document.getElementById("usernameinput").value;
    const errorMessage1 = validateUsername(username)
    if (errorMessage1 === "") {
        // validation succeeded
        console.log('username is:', username);
    }

    const password = document.getElementById("passwordinput").value;
    const errorMessage2 = validatePassword(password)
    if (errorMessage2 === "") {
        // validation succeeded
        console.log('password is:', password);
    }

    if (errorMessage1 === true && errorMessage2 === true)
        window.location = "../navigationPge/page4.html";
}


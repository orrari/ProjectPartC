function CheckD() {
    const date = new Date(document.getElementById('dateinput').value);
    const today = new Date();
    if (date.getTime() <= today.getTime()) {
        alert("You Can't Assign Trip For Expired Date");
        document.getElementById('dateinput').value = "";
    } else {
        return true;
    }
}

function validatePrice(input) {
    const error = document.getElementById("error1")
    if (input.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    } else {
        const price = /^[0-9\$\.]+$/;
        if (input.match(price)) {
            error.textContent = ""
            return true;
        } else {
            error.textContent = 'this character is not match for this field'
            error.style.color = "red"
            return false;
        }
    }
}

function validateInput(input) {
    const error = document.getElementById("error4")
    if (input.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    }
    error.textContent = ""
    return true;
}

function validateStart(input) {
    const error = document.getElementById("error8")
    if (input.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    }
    error.textContent = ""
    return true;
}

function validateEnd(input) {
    const error = document.getElementById("error9")
    if (input.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    }
    error.textContent = ""
    return true;
}

function validateAddress(address) {
    const error = document.getElementById("error2")
    if (address.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    } else {
        const letters = /^[0-9a-zA-Z\s]+$/;
        if (!address.match(letters)) {
            error.textContent = "invalid address input"
            error.style.color = "red"
            return false;
        }
    }
    error.textContent = ""
    return true;
}

function validateDogName(dog) {
    const error = document.getElementById("error3")
    if (dog.length === 0) {
        error.textContent = "Oops! This is a required field"
        error.style.color = "red"
        return false;
    } else {
        const letters = /^[A-Za-z\s]*$/;
        if (dog.match(letters)) {
            error.textContent = ""
            return true;
        } else {
            error.textContent = 'this character is not match for name field (name)'
            error.style.color = "red"
            return false;
        }
    }
}


const submit = () => {
    const name = document.getElementById("nameinput").value;
    const errorMessage1 = validateName(name)
    if (errorMessage1 === "") {
        // validation succeeded
        console.log('name is:', name);
    }

    const phone = document.getElementById("phoneinput").value;
    const errorMessage2 = validatePhone(phone)
    if (errorMessage2 === "") {
        // validation succeeded
        console.log('phone is:', phone);
    }

    const date = document.getElementById("dateinput").value;
    const errorMessage3 = validateInput(date)
    if (errorMessage3 === "") {
        // validation succeeded
        console.log('date is:', date);
    }

    const dogname = document.getElementById("doginput").value;
    const errorMessage4 = validateDogName(dogname)
    if (errorMessage4 === "") {
        // validation succeeded
        console.log('name is:', dogname);
    }

    const price = document.getElementById("priceinput").value;
    const errorMessage5 = validatePrice(price)
    if (errorMessage5 === "") {
        // validation succeeded
        console.log('price is:', price);
    }

    const start = document.getElementById("beginput").value;
    const errorMessage6 = validateStart(start)
    if (errorMessage6 === "") {
        // validation succeeded
        console.log('start is:', start);
    }

    const end = document.getElementById("endinput").value;
    const errorMessage7 = validateEnd(end)
    if (errorMessage7 === "") {
        // validation succeeded
        console.log('end is:', end);
    }

    const address = document.getElementById("addressinput").value;
    const errorMessage8 = validateAddress(address)
    if (errorMessage8 === "") {
        // validation succeeded
        console.log('address is:', address);
    }

    if (errorMessage1 === true && errorMessage2 === true && errorMessage3 === true && errorMessage4 === true && errorMessage5 === true && errorMessage6 === true && errorMessage7 === true && errorMessage8 === true)
        window.alert('Your form has been created successfully!');
}

const image_input = document.querySelector("#image-input");
image_input.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});
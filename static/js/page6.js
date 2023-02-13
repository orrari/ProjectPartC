function CheckD() {
    const date = new Date(document.getElementById('dateinput').value);
    const today = new Date();
    if (date.getTime() <= today.getTime()) {
        alert("You Can't Search Trip For Expired Date");
        document.getElementById('dateinput').value = "";
    } else {
        return true;
    }
}

const successCallback = (position) => {
    console.log(position);
};

const errorCallback = (error) => {
    console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
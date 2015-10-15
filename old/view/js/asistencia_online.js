function myFunction() {
    var text;

    // Get the value of the input field with id="numb"
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var message = document.getElementById("message").value;


    // If x is Not a Number or less than one or greater than 10
    if (name != "" && email != "" &! isNaN(phone) && message !="") {
        text = "Input not valid";
        window.alert("Tu mensaje fue mandado. Respondemos dentro de 5 dias");
    } else {
        text = "Input OK";
        window.alert("Los campos faltan informacion");
    }
    document.getElementById("demo").innerHTML = text;
}
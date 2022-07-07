import axios from "axios";
import 'dotenv/config';



axios
    .post("https://matrix.fusionacademy.com/Account/Login", {
        UserName: process.env.USER_NAME,
        Password: process.env.PASSWORD,
    })
    .then((response) => {
        console.log("Login Successful!");
    });



const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
    // the static expression is to enable the server access static files such as images n css
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", function(req, res){
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;

  const data = {
      members: [ //  members here is gotten from the mailchimp Api reference and it is a specified name which will be identified by the server
        {
        email_address: email, // the email used here is the variable name for the email address imputed
        status:"subscribed",
        merge_fields:{
          FNAME: firstName, // FNAME, LNAME are gotten from mailchimp and are keywords the server would identify with.
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data); //this code is the convert the object data above into JSON

  const url = "https://us1.api.mailchimp.com/3.0/lists/9bbcf0e45d"

  const options={ // from the documentations for https request, we define options with key words and the most imp are method and auth(authentication)
    method: "POST",
    auth: "Neville:a28272a147e6bef86e900aa72f845191-us1" //the auth  keyword is defined with any name followed by the API key which acts as a password
  }

  const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
          res.sendFile(__dirname + "/Success.html");
        }else{
          res.sendFile(__dirname + "/failure.html");
        }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })

    request.write(jsonData); // this is send the request to the server according to the docs
    request.end(); // this shows that its the end

});

app.post("/failure", function(req, res){
  res.redirect("/"); // this redirect function redirect the client to the designated page("/") when the button on the /failure" page is clicked
});

app.listen(process.env.PORT || 3000, function(){ // process.env.PORT is used when deploying the app on heroku, so that it can be run on any server and not necessarily 3000.
  console.log("server is running on port 3000")
});



// API KEY
// a28272a147e6bef86e900aa72f845191-us1
//
// LIST ID
// 9bbcf0e45d

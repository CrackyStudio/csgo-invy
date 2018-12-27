const express = require("express");
const app = express();
const main = require('./models/main.js')
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(session({ secret:'ssshhhhhh', resave: true, saveUninitialized: true, cookie: {expires: new Date(253402300000000)}}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

require("./routes/main.js")(app);

app.listen(1337, () => {
  console.log("Listening on port 1337");
});

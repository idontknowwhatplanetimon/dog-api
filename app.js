const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const morgan = require("morgan");
const session = require("express-session");
const app = express();
const port = 3000;

const authenticate = require("./js/authenticate");
const signup = require("./js/signup");
const dogs = require("./js/dogs");
const profile = require("./js/profile");

app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("combined"));
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(authenticate);
app.use(signup);
app.use("/dogs", dogs);
app.use("/profile", profile);

app.get("/", function (req, res) {
	const username = req.user ? req.user.username : "";
	res.render("home", { success_message: req.flash("success"), usernotfound: req.flash("not-found"), isLoggedIn: req.isLoggedIn, username: username });
});

app.listen(port, function () {
	console.log(`App listening at http://localhost:${port}`);
});

const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");
const router = express.Router();

const password = "4KR2FQqdjrkyIKSm";
const dbName = "dogs_app";
const uri = `mongodb+srv://pasha_admin:${password}@cluster0.kyazo.mongodb.net/${dbName}?retryWrites=true&w=majority`;

passport.use(new LocalStrategy(
	function(username, password, cb) {
		db.users.findByUsernameDb(username, function(err, user) {
			if (err) { return cb(err); }
			if (!user) { return cb(null, false); }
			if (user.password != password) { return cb(null, false); }
			return cb(null, user);
		});
	}
));

passport.serializeUser(function(user, cb) {
	cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
	db.users.findByIdDb(id, function(err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

router.use(passport.initialize());
router.use(passport.session());

router.use(bodyParser.urlencoded());
router.use(function(req, res, next) {
	req.isLoggedIn = req.user ? true : false;
	next();
});

router.get("/login", function(req, res) {
	res.render("login", { error_message: req.flash("error"),
		success_message: req.flash("success") });
});

router.post(
	"/login",
	passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login",
		failureFlash: "Invalid username or password.",
		successFlash: "Welcome!" 
	})
);

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

module.exports = router;

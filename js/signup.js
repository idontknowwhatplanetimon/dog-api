const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const router = express.Router();

const password = "4KR2FQqdjrkyIKSm";
const dbName = "dogs_app";
const uri = `mongodb+srv://pasha_admin:${password}@cluster0.kyazo.mongodb.net/${dbName}?retryWrites=true&w=majority`;

router.use(bodyParser.urlencoded());

router.get("/signup", function(req, res) {
	res.render("signup", { error_message: req.flash("error") });
});

router.post("/signup", function(req, res) {

	MongoClient.connect(uri, function(err, client) {
		const db = client.db(dbName);

		let user = db.collection("users").findOne({ username: req.body.username })
			.then(user => {
				if (!user) {
					db.collection("users").insertOne({
						username: req.body.username,
						password: req.body.password
					});
					req.flash("success", "You have successfuly created your account.");
					res.redirect("/login");
				} else {
					req.flash("error", "This username is already taken.");
					res.redirect("/signup");
				}
				client.close();
			});
	});
});

module.exports = router;

const express = require("express");
const https = require("https");
const router = express.Router();
const db = require("../db");

const API = "https://api.TheDogAPI.com/v1";

router.get("/:username", function(req, res) {
	const { username } = req.params
	db.users.findByUsernameDb(username, function(err, user) {
		if (user) {
			const options = {
				headers: {
					"x-api-key": "b5cd0ed8-a9fb-48ef-ae30-a0e3a03af0cd",
				},
			};

			https
				.get(
					`${API}/favourites?sub_id=${user.username}`,
					options,
					(resp) => {
						let data = "";
						
						resp.on("data", (chunk) => {
							data += chunk;
						});

						resp.on("end", () => {
							res.render("profile", { username: username, images: JSON.parse(data) });
						});
					}
				);
		} else {
			req.flash("not-found", "User wasn't found.");
			res.redirect("/");
		}	
	});
});

module.exports = router;

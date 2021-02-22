const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const router = express.Router();
const API = "https://api.TheDogAPI.com/v1";

router.use(bodyParser.text());

router.get("/images", function (req, res) {
	const options = {
		headers: {
			"x-api-key": "b5cd0ed8-a9fb-48ef-ae30-a0e3a03af0cd",
		},
	};

	https
		.get(
			`${API}${req.url}/search?page=0&limit=18&order=asc`,
			options,
			(resp) => {
				let data = "";

				resp.on("data", (chunk) => {
					data += chunk;
				});

				resp.on("end", () => {
					res.render("dogs_images", { images: JSON.parse(data), isLoggedIn: req.isLoggedIn });
				});
			}
		)
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
});

router.get("/breeds", function (req, res) {
	const options = {
		headers: {
			"x-api-key": "b5cd0ed8-a9fb-48ef-ae30-a0e3a03af0cd",
		},
	};

	https
		.get(`${API}${req.url}?page=0&limit=6`, options, (resp) => {
			let data = "";

			resp.on("data", (chunk) => {
				data += chunk;
			});

			resp.on("end", () => {
				res.render("dog_breeds", { breeds: JSON.parse(data) });
			});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
});

router.post("/images", function(req, res) {
	if (req.body && req.user) {
		
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": "b5cd0ed8-a9fb-48ef-ae30-a0e3a03af0cd",
			}
		};

		const postData = {
			image_id: req.body,
			sub_id: req.user.username
		};

		const request = https.request(`${API}/favourites`, options, function(resp) {
			resp.setEncoding("utf8");
			resp.on("data", (chunk) => {
				console.log(`BODY: ${chunk}`);
			});

			resp.on("end", () => {
				console.log("No more data in response.");
			});
		});
		
		request.on("error", (err) => {
			console.log("Error: " + err.message);
		});

		request.write(JSON.stringify(postData));
		request.end();
	}
	res.end();
});

router.get("/images/:breedId", function (req, res) {
	const { breedId } = req.params;

	const options = {
		headers: {
			"x-api-key": "b5cd0ed8-a9fb-48ef-ae30-a0e3a03af0cd",
		},
	};

	https
		.get(
			`${API}/images/search?page=0&limit=18&order=asc&breed_id=${breedId}`,
			options,
			(resp) => {
				let data = "";

				resp.on("data", (chunk) => {
					data += chunk;
				});

				resp.on("end", () => {
					console.log(JSON.parse(data));
					res.render("dogs_images", { images: JSON.parse(data) });
				});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
});

module.exports = router;

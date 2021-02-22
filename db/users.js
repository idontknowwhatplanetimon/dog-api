const { MongoClient, ObjectId } = require("mongodb");

const password = "4KR2FQqdjrkyIKSm";
const dbName = "dogs_app";
const usersCollectionName = "users";
const uri = `mongodb+srv://pasha_admin:${password}@cluster0.kyazo.mongodb.net/${dbName}?retryWrites=true&w=majority`;

exports.findByUsernameDb = function(username, cb) {
	MongoClient.connect(uri, function(err, client) {
		const db = client.db(dbName);
		db.collection(usersCollectionName)
		.findOne({ username: username })
		.then(function(user) {
			client.close();	

			if (user) {
				return cb(null, user);
			} else {
				return cb(null, null);
			}	
		});
	});
}

exports.findByIdDb = function(id, cb) {
	MongoClient.connect(uri, function(err, client) {
		const db = client.db(dbName);
		let user = db.collection(usersCollectionName)
			.findOne({ _id: new ObjectId(id) })
			.then(function(user) {
				client.close();	

				if (user) {
					cb(null, user);
				} else {
					cb(new Error("User " + id + " does not exist"));
				}	
			});	
	});
}

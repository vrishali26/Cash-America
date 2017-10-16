var express = require('express');
var http = require('http');
var path = require('path');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/User';
var ObjectId = require('mongoose').Types.ObjectId;
var app = express();
var db_result;
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.bodyParser());

//----------------------for cross domain----------------------------
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		return res.end();
	} else {
		return next();
	}
});
//----------------------for sign up----------------------------
app.post('/signup', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var DB_data = req.body;

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			var collection = db.collection('users');

			// do some work here with the database.
			collection.insert([DB_data], function(err, result) {
				console.log(result);
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
					res.end(JSON.stringify(DB_data));
				}
			});
			collection.find().toArray(function(err, result) {
				if (err) {
					console.log(err);
				} else if (result.length) {
					console.log('Found:', result);
				} else {
					console.log('No document(s) found with defined "find" criteria!');
				}
			});
		}
	});

});

//----------------------for sign up validation-----------------
app.get('/validateuser', function(req, res) {
	console.log(req.param("user_name"));
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			var collection = db.collection('users');

			collection.find({
				"Name" : req.param("user_name")
			}).toArray(function(err, result) {
				if (err) {
				} else if (result.length) {
					res.end('1');
				} else {
					res.end('0');
				}
			});

		}
	});
});

//----------------------for sign In----------------------------

app.get('/signin', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			var collection = db.collection('users');
			var res_data;
			getZipCode(db, function(d) {
				res.end(JSON.stringify(d));
			});
		}

	});

	var getZipCode = function(db, callback) {
		db.collection('users').aggregate([{
			$match : {
				"Email_Id" : req.param("email")
			}
		}], function(err, results) {
			callback(results[0]);
		});
	};
});

//----------------------for facebook sign in----------------------------
app.post('/facebookLogin', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var fb_data = req.body;
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			var collection = db.collection('users');
			console.log(fb_data.f_Id);

			if (fb_data._id) {
				db.collection('users').update({
					"_id" : fb_data._id
				}, {
					$set : {
						"zipCode" : fb_data.zipCode
					}
				}, function(err, result) {

					if (err) {
						//console.log(err);
					} else {
						console.log(fb_data);
						res.end(JSON.stringify(fb_data));
					}
				});

			} else {
				collection.find({
					"f_Id" : fb_data.f_Id
				}).toArray(function(err, result) {
					if (err) {
						console.log(err);
					} else if (result.length) {
						console.log('Found:', result[0].first_name);
						console.log('Found:', result[0]._id);
						res.end(JSON.stringify(result[0]._id));

					} else {
						console.log('No document(s) found with defined "find" criteria!');
						collection.insert([fb_data], function(err, result) {
							//console.log(result);
							if (err) {
								console.log(err);
							} else {
								collection.insert([fb_data], function(err, result) {
									console.log(result);
									if (err) {
										console.log(err);
									} else {
										console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
									}
								});
							}
						});
					}
				});

			}
		}
	});

});

//---------------------for Inventory-------------------------
app.get('/getCatgoryJson', function(req, res) {
	var fs = require('fs');
	var mainCatagory = [];
	var obj;
	fs.readFile('../data/categories.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		obj = JSON.parse(data);
		console.log(obj);
		res.end(JSON.stringify(obj));
	});

});

//---------------------for subcatgory store-------------------------
app.get('/getSubCatagoryStores', function(req, res) {
	var fs = require('fs');
	console.log(req.route.path);
	console.log(req.param("cata_code"));
	var cat_code = req.param("cata_code");
	req.route.path = "/getSubCatagoryStores" + cat_code;
	console.log(req.route.path);
	var obj;
	fs.readFile('../data/' + cat_code + '.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		obj = JSON.parse(data);
		//console.log(obj);
		res.end(JSON.stringify(obj));
	});
	//res.redirect('http://localhost:4000//getSubCatagoryStores/'+cat_code+'');
});

//-----------Stores List--------------
app.get('/storeList', function(req, res) {
	var fs = require('fs');
	var stores;
	fs.readFile('../data/stores.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		stores = JSON.parse(data);
		console.log(stores);
	});
});

//-----------Home Page Offers --------------
app.get('/homeOffers', function(req, res) {
	var fs = require('fs');
	var stores;
	fs.readFile('../data/home.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		stores = JSON.parse(data);
		console.log(stores);
	});
});

//-----------Subcategories Stores List--------------
app.get('/searchStores', function(req, res) {
	var fs = require('fs');
	var searchKeyword = req.param("sk");
	var flname = req.param("categoryCode");

	if (flname) {
		fs.readFile('../data/' + flname + '.json', 'utf8', function(err, data) {
			if (err)
				throw err;
			res.end(data);
		});
	} else {
		var fileData = require('../data/categories.json');
		//console.log(searchKeyword);
		//console.log(fileData[0].categoryName);
		var matchedCat = [];
		for ( i = 0; i < fileData.length; i++) {

			if (fileData[i].categoryName.toLowerCase().indexOf(searchKeyword) > -1) {
				console.log(fileData[0].categoryName);
				console.log("found");
				matchedCat.push(fileData[i]);
			} else {
				console.log("Please Enter Correct Keyword.");
			}
		}
		console.log(matchedCat);
		res.end(JSON.stringify(matchedCat));
	}
});

app.post('/changeLocation', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var data = req.body;
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			var collection = db.collection('users');
			console.log("when connection established", data._id);
			// do some work here with the database.
			collection.update({
				'_id': new ObjectId(data._id)
			}, {
				
				$set : {
					"Zip_code" : data.newZipCode
				}
					
			});
			
			collection.findOne({'_id': new ObjectId(data._id)}, function(err, document) {
			  console.log(document);
			  res.end(JSON.stringify(document));
			});
			//----------------------------------------
			
		}
	});
});
http.createServer(app).listen(4000, function() {
	console.log("Express server listening on port 4000");
});

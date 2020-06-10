// Full Documentation - https://docs.turbo360.co
var createError = require('http-errors');
const express = require('express')
var bodyParser=require("body-parser");
var ObjectId = require('mongodb').ObjectId
const router = express();
const util=require('util')
const mongoose=require('mongoose')
const  User=require('../models/user')
var usersRouter = require('./users');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('../authenticate');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(bodyParser.json());

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
//connecting to mongo

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://akap97:1mp00s1b13@cluster0-2zcgi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if(err) throw err;
});
const connectmongoose=mongoose.connect(uri, {dbName: 'AwesomeApartments'});
connectmongoose.then((db)=>{
	console.log("mongoose connected");
})
.catch((err) => {
	console.log(err);
});

router.use(passport.initialize());
router.use('/users', usersRouter);
router.get('/',(req, res,next) => {
// perform actions on the collection object
//console.log("testingjwt:"+req.user)
//console.log("sucessfully connected to db");
//search the db
client.db("AwesomeApartments").collection("areas").find({}).toArray().then((datadb) => { 
//console.log(JSON.stringify(data))
res.render('index', {data: datadb})
}).catch(err => 
{
console.log(err);
return;
});
})

router.get('/:areaslug', (req, res) => {
let areavar={}
//console.log("sucessfully connected to db");
//search the db
return client.db("AwesomeApartments").collection("areas").findOne({slug: req.params.areaslug})
.then((datadb) => { 
//console.log("bugtesting"+JSON.stringify(req.url));
areavar=datadb;
//console.log("area:",JSON.stringify(area._id));
return client.db("AwesomeApartments").collection("apartments").find({area:datadb._id}).toArray()
})
.then((apartmentdb) =>{
	//console.log("test",JSON.stringify(apartments));
		apartmentdb.forEach((apt,i) =>{
			let aptid=apt._id.toString();
			client.db("AwesomeApartments").collection("images").find({apartmentId:aptid}).toArray()
			.then((imgdata) =>{
				//console.log("imgdata:"+JSON.stringify(imgdata))
				apartmentdb[i].remoteImages=imgdata;
				apartmentdb[i].bigimage=imgdata[0];
				console.log(JSON.stringify(apartmentdb[i].bigimage))
				//console.log("error:"+apartmentdb[i].remoteImages)
				//console.log("type:"+typeof apartmentdb[i].remoteImages)
				if(apartmentdb.length-1===i){
					areavar.apartments=apartmentdb;
					return res.render('area',areavar);
				}
			
			})
		})
})
.catch(err => 
{
console.log(err);
return;
})
});

router.post('/apartment/:id',(req, res) => {
	console.log("query id:"+req.params.id)
	let newApartment=req.body.desc;
	//console.log("body:"+JSON.stringify(newApartment))
	client.db("AwesomeApartments").collection("apartments").updateOne({_id:ObjectId(req.params.id)}, {$set:req.body})
	//client.db("AwesomeApartments").collection("apartments").findOne({_id:ObjectId(req.params.id)})
	.then ((data) => {
		//console.log("bugtestingv2:"+JSON.stringify(data));
		res.redirect('/');
	})
	.catch(err =>{
		console.log(err);
		return;
	})
	return;
})

router.post('/upload',(req, res) =>{
	//console.log(req.body);
	client.db("AwesomeApartments").collection("images").insertOne({apartmentId:req.body.id, url:req.body.url}) 
	.then((data) =>{
	  //console.log("mongoimageupload"+data);
	})
	.catch((err) =>{
	  console.log(err);
	})
});


router.post('/:areaslug',(req, res) =>{
let params=req.body;
console.log("bug once again"+req.url)
const collectionarea = client.db("AwesomeApartments").collection("areas");
collectionarea.findOne({slug: req.params.areaslug}).then((datadb) => { 
params.area=datadb._id;
return client.db("AwesomeApartments").collection("apartments").insertOne(params);
}).then((apartment) =>{
	//console.log(apartment);
	res.redirect("/"+req.params.areaslug);

}).catch(err => 
{
console.log(err);
return;
});	
});

/*  This route render json data */
router.get('/json', (req, res) => {
	res.json({
		confirmation: 'success',
		router: process.env.TURBO_APP_ID,
		data: 'this is a sample json route.'
	})
})

/*  This route sends text back as plain text. */
router.get('/send', (req, res) => {
	res.send('This is the Send Route')
})

/*  This route redirects requests to Turbo360. */
router.get('/redirect', (req, res) => {
	res.redirect('https://www.turbo360.co/landing')
})

// catch 404 and forward to error handler
router.use(function(req, res, next) {
	next(createError(404));
  });
  
  // error handler
  router.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });

module.exports = router

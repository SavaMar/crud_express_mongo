// Simple CRUD
// Create (POST) - Make something
// Read (GET)_- Get something
// Update (PUT) - Change something
// Delete (DELETE)- Remove something

// (res)request   - запрос
// (req)response  - ответ

const express = require('express');
const bodyParser= require('body-parser')  //body-parser
//Express doesn’t handle reading data from the <form> element
// https://www.npmjs.com/package/body-parser
// const MongoClient = require('mongodb').MongoClient
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

const app = express();


app.use(bodyParser.urlencoded({extended: true})) //Make sure you place body-parser before your CRUD handlers!
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

var db
//mongod --dbpath=/data

MongoClient.connect('mongodb://localhost:27017/qt-test', (err, database) => {
  if (err) return console.log(err)
  db = database
})


// app.get('/', (req,res) => {
// 	// res.sendFile(__dirname + '/index.html')
// 	res.sendFile('/home/mari/my_proj/nodeJ/crud-express-mongo' + '/index.html')
// })

// READ
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

//Now, you can run: npm start _ to trigger nodemon server.js.
//nodemon - возможность не перезагружать сервак при изменениях в коде серверной стороны
//в package.js edit: "start": "nodemon server.js"

// app.post('/quotes', (req, res) => {
//   console.log(req.body) //{ name: 'eferf', quote: 'refer' }
// })

//CREATE
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

// UPDATE
app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


  app.listen(3000, () => {
    console.log('listening on 3000')
  })
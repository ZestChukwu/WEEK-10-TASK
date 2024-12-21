var express = require('express')
let Books = require('./Bookschema')
let mongodbConnected = require('./MongoDBConnect')
const cors = require('cors')

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
console.log("BOOKS", Books)

app.get('/', (req, res) => {
      console.log("HELLO")
})

app.get('/about', async (req, res) => {
      try {
            const count = await Books.countDocuments().exec()
            console.log("Total documents Count before addition : ", count)
            res.send("mongodb express React and mongoose app, React runs in another application")
      } catch (err) {
            console.log(err)
            res.status(500).send('Error counting documents')
      }
})

app.get('/allbooks', async (req, res) => {
      try {
            const books = await Books.find()
            res.json(books)
      } catch (err) {
            console.log(err)
            res.status(500).send('Error fetching books')
      }
})

app.get('/getbooks/:id', async (req, res) => {
      try {
            const id = req.params.id
            const book = await Books.findById(id)
            res.json(book)
      } catch (err) {
            console.log(err)
            res.status(500).send('Error fetching book')
      }
})

app.post('/addbooks', async (req, res) => {
      try {
            console.log("Ref", req.body)
            let newbook = new Books(req.body)
            console.log("newbook->", newbook)
            await newbook.save()
            res.status(200).json({ 'book': 'added successfully' })
      } catch (err) {
            console.log(err)
            res.status(400).send('adding new book failed')
      }
})

app.post('/updatebooks/:id', async (req, res) => {
      try {
            const id = req.params.id
            const updatedbook = new Books(req.body)
            console.log("update id", id, "newbook->", updatedbook)

            await Books.findByIdAndUpdate(id, {
                  booktitle: updatedbook.booktitle,
                  PubYear: updatedbook.PubYear,
                  author: updatedbook.author,
                  Topic: updatedbook.Topic,
                  formate: updatedbook.formate
            })
            res.status(200).json({ 'book': 'updated successfully' })
      } catch (err) {
            console.log(err)
            res.status(500).send('Error updating book')
      }
})

app.post('/deletebooks/:id', async (req, res) => {
      try {
            const id = req.params.id
            console.log("deleting")
            await Books.findByIdAndRemove(id)
            res.status(200).send('book deleted')
      } catch (err) {
            console.log(err)
            res.status(500).send('Error deleting book')
      }
})

app.listen(5000, () => {
      console.log("Server is running on port 5000")
})
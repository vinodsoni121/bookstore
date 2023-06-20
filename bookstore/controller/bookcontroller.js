const Book = require('../model/dbbooks.js');
const asyncHandler = require("express-async-handler");

const createbook =  (req, res) => {
    const { name, price, email } = req.body;
  
    // Create a new Book instance
    const newBook = new Book({
      name: name,
      price: price,
      email: email
    });
  
    // Save the book to the database
    newBook.save((error, book) => {
      if (error) {
        console.log(error);
        res.send('Error occurred while saving the book');
      } else {
        console.log(book);
        res.send('Form submitted successfully');
      }
    });
  }

  const getbooks = (req, res) => {
    // Fetch data from the database
    Book.find({}, (err, books) => {
      if (err) {
        console.log(err);
        res.send('Error occurred while fetching books');
      } else {
        // Pass the fetched data to the EJS template
        res.render('home', { books: books });
      }
    });
  }

  const deletebooks = asyncHandler((req, res) => {
    const bookId = req.params.id;
  
    Book.findByIdAndDelete(bookId, (error) => {
      if (error) {
        console.log(error);
        res.send('Error occurred while deleting the book');
      } else {
        res.redirect('/books');
      }
    });
  })

  const updatebook = asyncHandler(async (req, res) => {
    try {
      const bookId = req.params.id;
      console.log("bookid",bookId)
      const updatedBook = {
        name: req.body.name,
        price: req.body.price,
        email: req.body.email,
      };
  
      const book = await Book.findByIdAndUpdate(bookId, updatedBook, {
        new: true,
        runValidators: true,
      });
  
      if (!book) {
        res.status(404).send('Book not found');
        return;
      }
  
      console.log(book);
      res.redirect(`/books/${bookId}`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error occurred while updating the book');
    }
  });

  const getbook = asyncHandler(async (req, res)=>{
    const book = await Book.findById(req.params.id);
    if(!book){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(book);
})

module.exports = {
  createbook,getbooks,deletebooks,getbook,updatebook
};

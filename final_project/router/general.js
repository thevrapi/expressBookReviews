const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books && Object.keys(books).length > 0) {
    return res.status(200).send(JSON.stringify(books, null, 2));
  } else {
    return res.status(404).json({message: "No book reviews found"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const foundBook = books[isbn];
  if (foundBook) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({message: "No book found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksArray = Object.values(books);
  const filteredBooks = booksArray.filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 2));
  } else {
    return res.status(404).json({message: `No books found for '${author}' author.`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArray = Object.values(books);
  const filteredBooks = booksArray.filter(book => book.title.includes(title));
  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 2));
  } else {
    return res.status(404).json({message: `No books found with '${title}' title.`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const foundBook = books[isbn];
    if (foundBook && Object.keys(foundBook.reviews).length > 0) {
      return res.status(200).send(JSON.stringify(foundBook.reviews, null, 2));
    } else {
      return res.status(404).json({message: `No book or book reviews found for ISBN: ${isbn}`});
    }
});

module.exports.general = public_users;

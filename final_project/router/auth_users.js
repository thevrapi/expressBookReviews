const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      username: username
    }, 'access', { expiresIn: 60 * 60 })

    req.session.authorization = {
      accessToken
    };

    req.session.username = username

    return res.status(200).send("User successfully logged in")
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!review) {
    return res.status(400).json({ message: "You must provde a review for this bookk." })
  }

  if (!username) {
    return res.status(403).json({ message: "You are not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN not found" });
  }

  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
  } else {
    books[isbn].reviews[username] = review;
  }

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.username; // Retrieve username from session

  if (!username) {
    return res.status(403).json({ message: "You are not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]
    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } else {
    return res.status(404).json({ message: `Review not found for user ${username}` });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;

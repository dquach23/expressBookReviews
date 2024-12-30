const express = require('express');
const axions = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = { username, password };
    users.push(newUser);

    return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }
  
    return res.status(404).json({ message: `Not founded books by author: ${author}` });
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
  
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }
  
    return res.status(404).json({ message: `Not founded books by title: ${title}` });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  

  return res.status(300).json(books[isbn]);
});

module.exports.general = public_users;

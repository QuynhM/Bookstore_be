const fs = require("fs");
const crypto = require("crypto");
const { sendResponse, createError } = require("../../utils");
const {
  getAllBooksQuerySchema,
  addBookBodySchema,
  updateBookBodySchema,
} = require("./schema");

const controller = {
  getAllBooks: (req, res, next) => {
    try {
      const { value, error } = getAllBooksQuerySchema.validate(req.query);
      if (error) {
        throw createError(400, error);
      }
      let { page, limit, ...filterKeys } = value;

      //processing logic
      //Number of items skip for selection
      let offset = limit * (page - 1);

      //Read data from db.json then parse to JSobject
      let db = fs.readFileSync("db.json", "utf-8");
      db = JSON.parse(db);
      const { books } = db;
      //Filter data by title
      let result = [];

      if (filterKeys.length) {
        filterKeys.forEach((condition) => {
          result = result.length
            ? result.filter(
                (book) => book[condition] === filterQuery[condition]
              )
            : books.filter(
                (book) => book[condition] === filterQuery[condition]
              );
        });
      } else {
        result = books;
      }
      //then select number of result by offset
      result = result.slice(offset, offset + limit);

      //send response
      //   res.status(200).send(result);
      sendResponse(res, 200, result);
    } catch (error) {
      next(error);
    }
  },

  addBook: (req, res, next) => {
    //post input validation
    try {
      const { error, value } = addBookBodySchema.validate(req.body);
      if (error) {
        throw createError(401, error);
      }

      let { author, country, imageLink, language, pages, title, year } = value;

      // Read data from db.json then parse to JSobject
      let db = fs.readFileSync("db.json", "utf-8");
      db = JSON.parse(db);
      const { books } = db;

      // Check if the book with the same title already exists
      const existingBook = books.find(
        (book) => (book.title === title) & (book.author === author)
      );
      if (existingBook) {
        throw createError(409, "Book is already added");
      }

      //post processing
      const newBook = {
        author,
        country,
        imageLink,
        language,
        pages: parseInt(pages) || 1,
        title,
        year: parseInt(year) || 0,
        id: crypto.randomBytes(4).toString("hex"),
      };

      //Add new book to book JS object
      books.push(newBook);
      //Add new book to db JS object
      db.books = books;
      //db JSobject to JSON string
      db = JSON.stringify(db);
      //write and save to db.json
      fs.writeFileSync("db.json", db);

      //post send response
      //   res.status(200).send(newBook);
      sendResponse(res, 200, newBook);
    } catch (error) {
      next(error);
    }
  },

  updateBook: (req, res, next) => {
    //put input validation
    try {
      const { bookId } = req.params;
      const updates = req.body;

      // Validate the updates using the Joi schema
      const { error } = updateBookBodySchema.validate(updates);

      if (error) {
        throw createError(401, error);
      }

      // const updateKeys = Object.keys(updates);
      // //find update request that not allow
      // const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));

      // if (notAllow.length) {
      //   throw createError(401, `Update field not allow`);
      // }

      //put processing
      //Read data from db.json then parse to JSobject
      let db = fs.readFileSync("db.json", "utf-8");
      db = JSON.parse(db);
      const { books } = db;
      //find book by id
      const targetIndex = books.findIndex((book) => book.id === bookId);
      if (targetIndex < 0) {
        throw createError(404, `Book not found`);
      }

      // Compare existing book's fields with update fields
      const existingBook = db.books[targetIndex];
      const updateKeys = Object.keys(updates);
      const hasUpdated = updateKeys.some(
        (key) => existingBook[key] !== updates[key]
      );
      if (!hasUpdated) {
        throw createError(400, `Nothing has been updated`);
      }

      // Check for missing body info
      const missingInfo = updateKeys.filter((key) => !updates[key]);
      console.log(missingInfo);
      if (missingInfo.length > 0) {
        throw createError(400, `Missing body info: ${missingInfo.join(", ")}`);
      }

      //Update new content to db book JS object
      const updatedBook = { ...existingBook, ...updates };
      db.books[targetIndex] = updatedBook;

      //db JSobject to JSON string
      db = JSON.stringify(db);
      //write and save to db.json
      fs.writeFileSync("db.json", db);

      //put send response
      //   res.status(200).send(updatedBook);
      sendResponse(res, 200, updatedBook);
    } catch (error) {
      next(error);
    }
  },

  deleteBook: (req, res, next) => {
    //delete input validation
    try {
      const { bookId } = req.params;

      //delete processing
      //Read data from db.json then parse to JSobject
      let db = fs.readFileSync("db.json", "utf-8");
      db = JSON.parse(db);
      const { books } = db;
      //find book by id
      const targetIndex = books.findIndex((book) => book.id === bookId);
      if (targetIndex < 0) {
        throw createError(404, `Book not found`);
      }
      //filter db books object
      db.books = books.filter((book) => book.id !== bookId);
      //db JSobject to JSON string
      db = JSON.stringify(db, null, 2);
      //write and save to db.json
      fs.writeFileSync("db.json", db);

      //delete send response
      res.status(200).send({});
      sendResponse(res, 200, {});
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;

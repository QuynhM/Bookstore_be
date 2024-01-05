const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Routes
router.get("/", controller.getAllBooks);
router.post("/", controller.addBook);
router.put("/:bookId", controller.updateBook);
router.delete("/:bookId", controller.deleteBook);

module.exports = router;

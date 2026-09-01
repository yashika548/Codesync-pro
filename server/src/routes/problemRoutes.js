const express = require("express");

const {
  getProblems,
  getProblem,
} = require("../controllers/problemController");

const router = express.Router();

router.get("/", getProblems);

router.get("/:id", getProblem);

module.exports = router;
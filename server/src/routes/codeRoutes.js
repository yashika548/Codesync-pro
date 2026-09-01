const express = require("express");
const {
  runCode,
  getCodeResult,
  submitProblem,
  getSubmissionHistory,
  getSubmissionDetails,
} = require("../controllers/codeController");

const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/run", runCode);
router.get("/result/:token", getCodeResult);
router.post("/submit", protect, submitProblem);
router.get(
  "/submissions/history/:problemSlug",
  protect,
  getSubmissionHistory
);

router.get(
  "/submissions/details/:submissionId",
  protect,
  getSubmissionDetails
);


module.exports = router;
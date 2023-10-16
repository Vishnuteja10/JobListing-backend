const express = require("express");

const router = express.Router();

const {
  getJobs,
  getJobDetails,
  addJob,
  updatejob,
} = require("../controllers/jobs");

const VerifyAuthentication = require("../middlewares/VerifyAuthentication");

// get all jobs
router.route("/getjobs").get(getJobs);

// get details of specific job
router.route("/getjobs/:id").get(getJobDetails);

// add job
router.route("/job-post").post(VerifyAuthentication, addJob);

// edit job
router.route("/update-job").put(updatejob);

module.exports = router;

const Job = require("../models/jobs");

// get jobs from database
const getJobs = async (req, res) => {
  try {
    const queryObject = {};
    const { searchItem, skills } = req.query;

    if (searchItem) {
      queryObject.jobPosition = { $regex: searchItem, $options: "i" };
    }
    if (skills) {
      queryObject.skillsRequired = { $in: skills.split(",") };
    }
    const data = await Job.find(queryObject);
    res.json({ succes: true, data });
  } catch (error) {
    res.json({ succes: false, errorMessage: error });
  }
};

// add job to the database
const addJob = async (req, res) => {
  console.log("req bosy is :", req.body);
  try {
    const {
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      inOffice,
      jobLocation,
      jobDescription,
      aboutCompany,
      skillsRequired,
      information,
    } = req.body;

    // validation check
    if (
      !companyName ||
      !logoUrl ||
      !jobPosition ||
      !salary ||
      !jobType ||
      !inOffice ||
      !jobLocation ||
      !jobDescription ||
      !aboutCompany ||
      !skillsRequired ||
      !information
    ) {
      return res.json({
        succes: false,
        errorMessage: "all fields are required!",
      });
    }
    // add to database
    const job = new Job({
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      inOffice,
      jobLocation,
      jobDescription,
      aboutCompany,
      skillsRequired,
      information,
    });

    await job.save();

    res.json({
      success: true,
      jobPosition,
      message: "job added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error,
      errorMessage: "Something went wrong!",
    });
  }
};

// update specific jobdetails

const updatejob = async (req, res) => {
  const id = req.body.id;
  const data = req.body;

  try {
    const result = await Job.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    if (result == null) {
      return res.json({ success: false, message: "No Such data found" });
    } else {
      return res.json({ success: true, result });
    }
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const jobDetails = await Job.findById(id);
    if (jobDetails) {
      res.json({ success: true, message: "Job details fetched", jobDetails });
    } else {
      res.json({ success: false, errorMessage: "Job details not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addJob, getJobs, updatejob, getJobDetails };

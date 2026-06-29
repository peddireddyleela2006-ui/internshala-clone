const express = require("express");
const router = express.Router();

const Job = require("../Model/Job");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);

        const jobdata = new Job({
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            Experience: req.body.Experience,
            category: req.body.category,
            aboutCompany: req.body.aboutCompany,
            aboutJob: req.body.aboutJob,
            whoCanApply: req.body.whoCanApply,
            perks: req.body.perks,
            numberOfOpening: req.body.numberOfOpening,
            AdditionalInfo: req.body.AdditionalInfo,
            CTC: req.body.CTC,
            StartDate: req.body.StartDate,
        });

        const data = await jobdata.save();
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const data = await Job.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await Job.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
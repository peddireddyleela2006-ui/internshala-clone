const express = require("express");
const router = express.Router();
const Internship = require('../Model/Internship')
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const internshipdata = new Internship({
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            category: req.body.category,
            aboutCompany: req.body.aboutCompany,
            aboutInternship: req.body.aboutInternship,
            whoCanApply: req.body.whoCanApply,
            perks: req.body.perks,
            numberOfOpenings: req.body.numberOfOpenings,
            stipend: req.body.stipend,
            startDate: req.body.startDate,
            additionalInfo: req.body.additionalInfo
        });
        const data = await internshipdata.save();
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


//to get all the data from the backend(every internship data) - get request
router.get("/", async (req, res) => {
    try {
        const data = await Internship.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
});
//to get the data from the backend for a certain internship with match- get request
router.get("/:id", async (req, res) => {
    try 
    {
        const data = await Internship.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Internship not found" });
        }
        res.status(200).json(data);
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;


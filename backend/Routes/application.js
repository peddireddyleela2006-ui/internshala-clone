const express = require("express");
const router = express.Router();
const Application = require('../Model/Application')
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const applicationdata = new Application({
            company: req.body.company,
            category: req.body.category,
            coverLetter: req.body.coverLetter,
            user: req.body.user,
            Application: req.body.Application,
            body:req.body.body,
            
        })
        const data = await applicationdata.save();
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//to get all the data from the backend(every Application data) - get request
router.get("/", async (req, res) => {
    try {
        const data = await Application.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
});
//to get the data from the backend for a certain Application with match - get request
router.get("/:id", async (req, res) => {
    try {
        const data = await Application.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//for pending(which is default) but for the other - {'approved','rejected'} 
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    let status
    if (action === "approved") {
        status = "approved";
    } else if (action === "rejected") {
        status = "rejected";
    } else {
        res.status(404).json({ error: "Invalid action" });
        return;
    }
    try {
        const updateapplication = await Application.findByIdAndUpdate(id, { $set: { status } }, { new: true });
        if (!updateapplication) {
            res.status(404).json({ error: "Unable to update the application" });
            return;
        }
        res.status(200).json({ success: true, data: updateapplication });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})
module.exports = router

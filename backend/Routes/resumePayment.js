const express = require("express");
const router = express.Router();

const razorpay = require("../config/razorpay");


router.post("/create-resume-order", async(req,res)=>{

    try{

        const options = {
            amount: 50 * 100,
            currency:"INR",
            receipt:`resume_${Date.now()}`
        };


        const order = await razorpay.orders.create(options);


        res.json({
            success:true,
            order
        });


    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});


module.exports = router;
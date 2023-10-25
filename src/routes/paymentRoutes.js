
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
// const { instance } = require("../Database/");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");

// payment instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

router.post("/checkout", async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("catch err", error.message);
    res.status(500).send({ success: false, message: error.message, err: "Internal Server Error" });
  }
});

const redirectUrl = process.env.PAYMENT_SUCCESS_URL || "http://localhost:3000";

router.post("/paymentVerification", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database comes here

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

     res.redirect(
        `${redirectUrl}/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  }
  catch (error) {
    console.error("catch err", error.message);
    res.status(500).send({ success: false, message: error.message, err: "Internal Server Error" });
  }
});

module.exports = router;

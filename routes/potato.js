const express = require("express");
const { paymentRequest, getToken, paymentConfirmation, resendOTP, customerPhonePage, otpVerificationPage, getPaymentData, getBaseURL } = require("../controllers/potato");
const limiter = require("../middlewares/limiter");
const router = express.Router();

router.post("/get-token" ,getToken);
router.post("/payment-request" ,paymentRequest);
router.post("/payment-confirmation" ,paymentConfirmation);
router.post("/resend-otp" ,resendOTP);
router.post("/customerPhone-page" ,customerPhonePage);
router.get("/otpVerification-page" ,otpVerificationPage);
router.get("/payment-data" ,getPaymentData);
// router.get("/get-baseurl", getBaseURL);
module.exports = router;
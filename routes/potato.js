const express = require("express");
const { paymentRequest, getToken, paymentConfirmation, resendOTP, customerPhonePage, otpVerificationPage, getPaymentData, getBaseURL, getUrl } = require("../controllers/potato");
const limiter = require("../middlewares/limiter");
const router = express.Router();

router.post("/get-token" ,getToken);
router.post("/payment-request" ,paymentRequest);
router.post("/payment-confirmation" ,paymentConfirmation);
router.post("/resend-otp" ,resendOTP);
router.post("/get-url" ,getUrl);
router.get("/customerPhone-page/:transactionID" ,customerPhonePage);
router.get("/otpVerification-page/:transactionID" ,otpVerificationPage);
router.get("/payment-data" ,getPaymentData);
// router.get("/get-baseurl", getBaseURL);
module.exports = router;
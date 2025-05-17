// const { v4: uuidv4 } = require("uuid"); // npm i uuid
// const axios = require("axios");
// const { isValidString, isValidNumber, validateMerchantPhoneNumber, validateCustomerPhoneNumber, isValidAmount, verifyToken, isValidOTP } = require("../utils/validation");
// const { getVaultSecret } = require("../utils/vaultClient"); // غيّر المسار حسب المشروع
// let BASE_API_URL;

// (async () => {
//   try {
//     BASE_API_URL = await getVaultSecret("config", "BASE_API_URL");
//     console.log("🔗 BASE_API_URL from Vault:", BASE_API_URL);
//   } catch (err) {
//     console.error("🚨 Failed to load BASE_API_URL from Vault");
//     process.exit(1);
//   }
// })();

// const getToken = async (req, res) => {
//   try {
//     const { companyName, programmName, merchantMSISDN , code } = req.body;

//     if(!isValidString(companyName)) return res.status(400).json({message : "Invalid CompanyName"});
//     if(!isValidString(programmName)) return res.status(400).json({message : "Invalid ProgrammName"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }
//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
//       programmName,
//       companyName,
//       merchantMSISDN,
//       code,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error);
//   }
// };

// const paymentRequest = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, customerMSISDN, merchantMSISDN , amount, token } = req.body;
//     // console.log("SESSION:", req.session);

//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }
    
//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }

//     if(!validateCustomerPhoneNumber(customerMSISDN)) {
//       return res.status(400).json({message : "Invalid Phone Number. It must be a Syrian number starting with 09."});
//     }

//     if(!isValidAmount(amount)) return res.status(400).json({message : "Invalid Amount"});

//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
//       code,
//       customerMSISDN,
//       merchantMSISDN,
//       transactionID,
//       amount,
//       token,
//     });

//     if (response.data.details.otp) {
//       req.session.paymentData = {
//         ...req.session.paymentData,
//         otp: response.data.details.otp
//       };
//     }
//       // console.log(`"response" : ${response}`);
//     return res.status(response.status).json(response.data);
//     } catch (error) {
//       if (error.response) {
//         return res.status(error.response.status).json(error.response.data);
//       }
//       console.error("Error forwarding request:", error.message);
//     }
// };

// const paymentConfirmation = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN, OTP , token } = req.body;

//     // console.log("SESSION 🔍:", req.session);
//     // console.log("SESSION.paymentData 🔍:", req.session.paymentData);


//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }

//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }

//     if(!isValidOTP(OTP)) return res.status(400).json({message : "Invalid OTP"});
    
//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       OTP,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error.message);
//     console.log(error);
//   }
// };

// const resendOTP = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN , token } = req.body;

//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }

//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }
    
//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/resend-otp`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error.message);
//   }
// };

// const customerPhonePage = (req, res) => {
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
//   }

//   if (!isValidString(programmName)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
//   }

//   if (!isValidNumber(code)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
//   }


//   if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
//   }

//   if (!isValidAmount(amount)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();
//   }

//   const transactionID = uuidv4(); 

//   req.session.paymentData = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp : null
//   };

//   res.render("pages/customerPhone/customerPhone");
// };

// const otpVerificationPage = (req, res) => {
//   try{
//   // const {otp} = req.query;
//   const data = req.session.paymentData;

//   if (!data) {
//     return res.status(400).send("Session expired or invalid");
//   }

//   res.render("pages/otpVerification/otpVerification");

//   console.log("📍 OTP Verification Page Session:", req.session);
  
// }catch(error){
//   return res.status(400).json({error})
// }
// };

// const getPaymentData = (req, res) => {
//   if (!req.session.paymentData) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   res.json(req.session.paymentData);
// };

// const getBaseURL = async (req, res) => {
//   try {
//     const baseURL = await getVaultSecret("config", "BASE_API_URL2");
//     res.json({ baseURL });
//   } catch (error) {
//     res.status(500).json({ message: "Vault access error." });
//   }
// };

// module.exports = {
//   getToken,
//   paymentRequest,
//   paymentConfirmation,
//   resendOTP,
//   customerPhonePage,
//   otpVerificationPage,
//   getPaymentData,
//   getBaseURL
// };


const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const {
  isValidString,
  isValidNumber,
  validateMerchantPhoneNumber,
  validateCustomerPhoneNumber,
  isValidAmount,
  isValidOTP
} = require("../utils/validation");

BASE_API_URL = "http://localhost:5000"
// ======== API Handlers ========

const getToken = async (req, res) => {
  try {
    const { companyName, programmName, merchantMSISDN, code } = req.body;

    if (!isValidString(companyName)) return res.status(400).json({ message: "Invalid CompanyName" });
    if (!isValidString(programmName)) return res.status(400).json({ message: "Invalid ProgrammName" });
    if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
    if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });

    const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
      programmName,
      companyName,
      merchantMSISDN,
      code,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    console.error("Error forwarding request:", error);
  }
};

const paymentRequest = async (req, res) => {
  try {
    // const { transactionID } = req.session.paymentData;
    const { code, customerMSISDN, merchantMSISDN, amount, token , transactionID } = req.body;

    // if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
    if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
    if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
    if (!validateCustomerPhoneNumber(customerMSISDN)) return res.status(400).json({ message: "Invalid Customer Phone Number" });
    if (!isValidAmount(amount)) return res.status(400).json({ message: "Invalid Amount" });

    const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
      code,
      customerMSISDN,
      merchantMSISDN,
      transactionID,
      amount,
      token,
    });

    // if (response.data.details.otp) {
    //   req.session.paymentData = {
    //     ...req.session.paymentData,
    //     otp: response.data.details.otp
    //   };
    // }

    if (response.data.details.otp) {
    req.session.transactions = req.session.transactions || {};

    if (req.session.transactions[transactionID]) {
      req.session.transactions[transactionID].otp = response.data.details.otp;
    }
  }


    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    console.error("Error forwarding request:", error.message);
  }
};

const paymentConfirmation = async (req, res) => {
  try {
    // const { transactionID } = req.session.paymentData;
    const { code, merchantMSISDN, OTP, token , transactionID } = req.body;

    if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
    if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
    if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
    if (!isValidOTP(OTP)) return res.status(400).json({ message: "Invalid OTP" });

    const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
      code,
      transactionID,
      merchantMSISDN,
      OTP,
      token,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    console.error("Error forwarding request:", error.message);
  }
};

const resendOTP = async (req, res) => {
  try {
    // const { transactionID } = req.session.paymentData;
    const { code, merchantMSISDN, token , transactionID } = req.body;

    if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
    if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
    if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });

    const response = await axios.post(`${BASE_API_URL}/api/clients/resend-otp`, {
      code,
      transactionID,
      merchantMSISDN,
      token,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) return res.status(error.response.status).json(error.response.data);
    console.error("Error forwarding request:", error.message);
  }
};

// ======== Render Pages ========

// const customerPhonePage = (req, res) => {
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
//   if (!isValidString(programmName)) return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
//   if (!isValidNumber(code)) return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
//   if (!isValidAmount(amount)) return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();

//   const transactionID = uuidv4();

//   req.session.paymentData = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp: null
//   };

//   res.render("pages/customerPhone/customerPhone");
// };

// const otpVerificationPage = (req, res) => {
//   try {
//     const data = req.session.paymentData;
//     if (!data) return res.status(400).send("Session expired or invalid");
//     res.render("pages/otpVerification/otpVerification");
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// };

const getUrl = (req, res) => {
  const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
  const isDevRequest = req.headers["x-dev-request"] === "true";

  if (!isValidString(companyName)) return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
  if (!isValidString(programmName)) return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
  if (!isValidNumber(code)) return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
  if (!isValidAmount(amount)) return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();

  const transactionID = uuidv4();
  
  // خزّن كل العمليات في session
  req.session.transactions = req.session.transactions || {};
  req.session.transactions[transactionID] = {
    companyName,
    programmName,
    code,
    transactionID,
    merchantMSISDN,
    amount,
    otp: null
  };

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const redirectUrl = `${baseUrl}/api/clients/customerPhone-page/${transactionID}`;

  res.json({ url: redirectUrl });
};

const customerPhonePage =  (req, res) => {
  // const { transactionID } = req.params;
  // const data = req.session.transactions?.[transactionID];

  // if (!data) return res.status(404).send("Transaction not found");

  res.render("pages/customerPhone/customerPhone");
};

const otpVerificationPage = (req, res) => {

  res.render("pages/otpVerification/otpVerification");
};

const getPaymentData = (req, res) => {
  const { transactionID } = req.query;

  if (!transactionID || !req.session.transactions?.[transactionID]) {
    return res.status(401).json({ message: "Unauthorized or invalid transaction" });
  }

  res.json(req.session.transactions[transactionID]);
};

// إزالة getBaseURL لأنه يعتمد على Vault
// const getBaseURL = ...

module.exports = {
  getToken,
  paymentRequest,
  paymentConfirmation,
  resendOTP,
  getUrl,
  customerPhonePage,
  otpVerificationPage,
  getPaymentData
};

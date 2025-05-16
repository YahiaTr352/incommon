
async function sendData() {

    try {
      baseURL = "http://localhost:3001";
      let fixedData;
       try {
        const res = await axios.get(`${baseURL}/api/clients/payment-data`, {
          withCredentials: true,
        });
        console.log(res);
        const rawData = res.data;

        fixedData = {
          companyName: DOMPurify.sanitize(rawData.companyName),
          programmName: DOMPurify.sanitize(rawData.programmName),
          merchantMSISDN: DOMPurify.sanitize(rawData.merchantMSISDN),
          code: DOMPurify.sanitize(rawData.code),
          amount: DOMPurify.sanitize(rawData.amount),
          transactionID: DOMPurify.sanitize(rawData.transactionID)
        };
       } catch (error) {
        showToast("Failed to load payment data.");
        console.log(error);
        return;
       }
      try{
      const response = await axios.post(`${baseURL}/api/clients/get-token`, {
        companyName : fixedData.companyName ,
        programmName : fixedData.programmName  ,
        merchantMSISDN : fixedData.merchantMSISDN  ,
        code : fixedData.code  
      }, {
        withCredentials: true
      });
      const data = response.data;
  
      if (data.errorCode === 0) {
        console.log(data.token);
        const token = DOMPurify.sanitize(data.token);
        document.cookie = `token=${token}; path=/; SameSite=Lax`;
      }

    }catch(error){
      showToast("something went wrong, try again later.")
    }

    function getCookie(name) {
      const cookies = document.cookie.split("; ");
      const found = cookies.find(row => row.startsWith(name + "="));
      return found ? found.split("=")[1] : null;
    }
    
    const token = getCookie("token");
  
      document.getElementById("paymentForm").addEventListener("submit", async function (event) {
        event.preventDefault();
  
        // const customerMSISDN = document.getElementById("customerMSISDN").value.trim();
        // const confirmCustomerMSISDN = document.getElementById("confirmCustomerMSISDN").value.trim();
        
        const customerMSISDN = DOMPurify.sanitize(document.getElementById("customerMSISDN").value.trim());
        const confirmCustomerMSISDN = DOMPurify.sanitize(document.getElementById("confirmCustomerMSISDN").value.trim());

        if(!customerMSISDN || !confirmCustomerMSISDN){
          showToast("All fields are required.");
          return;
        }
  
        if (customerMSISDN !== confirmCustomerMSISDN) {
          showToast("Phone numbers do not match.");
          return;
        }
  
        const phoneRegex = /^0?9\d{8}$/;

        const validateCustomerPhoneNumber = (phoneNumber) => {
          return phoneRegex.test(phoneNumber) && !isNaN(phoneNumber);
        };        

        if (!validateCustomerPhoneNumber(customerMSISDN)){
          showToast("Invalid phone number. It must be a Syrian number starting with 09.");
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:3001/api/clients/payment-request', {
            code : fixedData.code ,
            customerMSISDN,
            merchantMSISDN : fixedData.merchantMSISDN, 
            amount : fixedData.amount,
            transactionID : fixedData.transactionID,
            token
          }, {
            withCredentials: true // ✨ ضروري جداً
          });
          const result = response.data;
  
          if (result.errorCode === 0) {
            showToast("You have received an OTP. ✅" , "success");
            setTimeout(() => {
              window.location.href = `http://localhost:3001/api/clients/otpVerification-page`;
            }, 3000);
          } 

        } catch (error) {
          console.log(error);
            if(error.response.status === 404){
              const errorMessage = DOMPurify.sanitize(error.response.data.message);
              showToast(errorMessage);
               return;
            }

            else{
              showToast("something went wrong, try again later.");
          }

          console.log(error);
        }
      });
  
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }
  
  window.onload = sendData;
  
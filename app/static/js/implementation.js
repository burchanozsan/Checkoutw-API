const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);


async function initCheckout() {
	try {
		const paymentMethodsResponse = await callServer("/api/getPaymentMethods", {});
		console.log("I'm HERE!!!")
        const configuration = {
         paymentMethodsResponse: paymentMethodsResponse, // The `/paymentMethods` response from the server.
         clientKey: clientKey, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
         locale: "en-US",
         environment: "test",
         onSubmit: (state, dropin) => {
         console.log("onSubmit")

             // Global configuration for onSubmit
             // Your function calling your server to make the `/payments` request
             handleSubmission(state, dropin, "/api/Payments");
               then(response => {
                 if (response.action) {
                   // Drop-in handles the action object from the /payments response
                   dropin.handleAction(response.action);
                 } else {
                   // Your function to show the final result to the shopper
                   showFinalResult(response);
                 }
               })
               .catch(error => {
                 throw Error(error);
               });
           },
         onAdditionalDetails: (state, dropin) => {
         console.log("onAdditionalDetails")
           // Your function calling your server to make a `/payments/details` request
           handleSubmission(state, dropin, "/api/submitAdditionalDetails");
             then(response => {
               if (response.action) {
                 // Drop-in handles the action object from the /payments response
                 dropin.handleAction(response.action);
               } else {
                 // Your function to show the final result to the shopper
                 showFinalResult(response);
               }
             })
             .catch(error => {
               throw Error(error);
             });
         },
         paymentMethodsConfiguration: {
             card: { // Example optional configuration for Cards
             hasHolderName: true,
             holderNameRequired: true,
             enableStoreDetails: true,
             hideCVC: false, // Change this to true to hide the CVC field for stored cards
             name: 'Credit or debit card',
//             onSubmit: () => {}, // onSubmit configuration for card payments. Overrides the global configuration.
           }
         }
        };

		console.log("before const checkout")
		const checkout = await AdyenCheckout(configuration);
		console.log("after const checkout")
		const dropin = checkout

          .create('dropin', {
          // Starting from version 4.0.0, Drop-in configuration only accepts props related to itself and cannot contain generic configuration like the onSubmit event.
              openFirstPaymentMethod:false
          })
         .mount('#dropin-container');

	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}


// Event handlers called when the shopper selects the pay button,
// or when additional information is required to complete the payment
async function handleSubmission(state, dropin, url) {
console.log("handleSubmission")
	try {
		const res = await callServer(url, state.data);
		handleServerResponse(res, dropin);
	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}

// Calls your server endpoints
async function callServer(url, data) {
console.log("callServer" +url +data)
	const res = await fetch(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : "",
		headers: {
			"Content-Type": "application/json"
		}
	});

	return await res.json();
}

// Handles responses sent from your server to the client
function handleServerResponse(res, dropin) {
    console.log("handleServerResponse")
	if (res.action) {
		dropin.handleAction(res.action);
	} else {
		switch (res.resultCode) {
			case "Authorised":
				window.location.href = "/result/success";
				break;
			case "Pending":
			case "Received":
				window.location.href = "/result/pending";
				break;
			case "Refused":
				window.location.href = "/result/failed";
				break;
			default:
				window.location.href = "/result/error";
				break;
		}
	}
}

initCheckout();
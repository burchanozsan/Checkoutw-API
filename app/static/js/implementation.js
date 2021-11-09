const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);


async function checkout() {
	try {
		const paymentMethodsResponse = await callServer("/api/getPaymentMethods", {});
        const configuration = {
         paymentMethodsResponse: paymentMethodsResponse, // The `/paymentMethods` response from the server.
         clientKey: clientKey,
         locale: "en-US",
         environment: "test",
         onSubmit: (state, dropin) => {

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
           }
         }
        };

		const checkout = await AdyenCheckout(configuration);
		const dropin = checkout

          .create('dropin', {
              openFirstPaymentMethod:false
          })
         .mount('#dropin-container');

	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}



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

function handleServerResponse(res, dropin) {
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

checkout();
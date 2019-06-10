import nethelper from "./nethelper"



let paypalObj = {
    header: nethelper.header,
    paypalBtn: function (ele, createBody) {
        // console.log(JSON.stringify(createBody));
        paypal.Button.render({
            // options
            env: 'production', // Or 'production'
            style: {
                label: 'checkout',  // checkout | credit | pay | buynow | generic
                size: 'responsive', // small | medium | large | responsive
                shape: 'rect',   // pill | rect
                color: 'silver',   // gold | blue | silver | black
                tagline: true
            },
            // Set up the payment:
            // 1. Add a payment callback
            payment: function (data, actions) {
                // 2. Make a request to your server
                createBody.header = nethelper.header;

                return actions.request.post('http://i.hashfun.tk/createPaypalId/', {json:JSON.stringify(createBody)})
                    .then(function (res) {
                        // 3. Return res.id from the response
                        console.log(res);
                        if (res.id) {
                            return res.id;
                        } else {
                            console.log(res.message.response);
                            let errData = JSON.parse(res.message.response.text);
                            console.log(errData);
                            alert(errData.message)
                        }

                    });
            },
            // Execute the payment:
            // 1. Add an onAuthorize callback
            onAuthorize: function (data, actions) {
                console.log(data);
                // 2. Make a request to your server
                createBody.iap = {
                    originalReceipt: data.paymentID,
                    productId: createBody.good.goodsId,
                    token: data.paymentID,
                    packageName: nethelper.packagename,
                    payerID: data.payerID
                };
                return actions.request.post('http://i.hashfun.tk/excutePaypalId/', {json:JSON.stringify(createBody)})
                    .then(function (res) {
                        if (res.status === 'success') {
                            window.localStorage.setItem("commentList", createBody.order.commentsList);
                            alert(res.status + "," + res.message);
                        } else {
                            alert(res.status + "," + res.message.errorMessage);
                        }
                        console.log(res);
                        // 3. Show the buyer a confirmation message.
                    });
            },
            // onCancel: function(data, actions) {
            //     alert('cancel')
            // },
            onError: function (err) {
                console.log(err);
                alert(err)
            }
        }, ele);
    }
};

export default paypalObj;

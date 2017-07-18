var express = require('express');
var _ = require('lodash');
var app = express();
var bodyParser = require('body-parser');
var Simplify = require("simplify-commerce");

app.use(bodyParser());
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Application listening on Port 3000');
});

var apiKeys = {
    publicKey: "sbpb_ZTRiNzA0YzMtMTFkNS00MTEyLTgxYjYtNWI2MDM3M2E1OWU4",
    privateKey: "PgBBypXMpZpw1OUr2gp+RRrQGNl/WrPmrFh05SPd9V55YFFQL0ODSXAOkNtXTToq"
}

app.post('/pay', function(req, res) {

	var data = {
        amount: req.body.amount,
        currency: "USD",
        card: {
            number: req.body.number.replace(/ /g, ""),
            expMonth: req.body.expiration.slice(0, 2),
            expYear: req.body.expiration.slice(3, 5),
            cvc: _.toString(req.body.cvc)
		}
    };

    simplifyPayment(apiKeys, data, function(error, result) {
        if(error) {
            res.send(error);
        }
        res.send(result);
    });
});

var simplifyPayment = function(key, data, callback) {
	client = Simplify.getClient({
		publicKey: key.publicKey,
		privateKey: key.privateKey
	});

	transactionData = {
		amount: data.amount,
		currency: data.currency,
		card: {
			number: data.card.number,
			expMonth: data.card.expMonth,
			expYear: data.card.expYear,
			cvc: data.card.cvc
		}
	}
	
	client.payment.create( transactionData, function(errData, successData) {
		if(errData) {
			callback(errData);
		}
		if(successData) {
			callback(null, successData);
		}
	})
};

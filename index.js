let express = require('express'),
	bodyParser = require('body-parser'),
	BoxSDK = require('box-node-sdk'),
	config = require('./config.json'),
	colors = require('colors/safe'),
	app = express(),
	port = process.env.PORT || 3000;


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port);

// Is the url that will listen for webhooks
app.post("/webhook-listener", function(request, response){
	let body = request.body;
	let headers = request.headers;
	let isValid = BoxSDK.validateWebhookMessage(JSON.stringify(body), headers, config.primaryWHKey, config.secondaryWHKey);

	if (isValid){
		console.log(colors.green('Webhook is valid.'));
		console.log(body);
		response.sendStatus(200);
	} else {
		console.log(colors.red('Suspected third party... Request is not valid'));
	}
});

console.log('Ready to listen for simple webhooks on Box... port: '+ port);
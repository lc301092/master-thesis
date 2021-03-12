const BTSP = require('bluetooth-serial-port');
const btSerial = new BTSP.BluetoothSerialPort();

const express = require('express');
const router = express.Router();

/* GET users listing. */
/// ### >>> DEL 1 <<< ###
btSerial.on('found', function (address, name) {


	// you might want to check the found address with the address of your
	// bluetooth enabled Arduino device here.
	if (name.toLowerCase().includes('hc')) {
		console.log('>>> found device with address +' + address + ' and name: ' + name + ' <<<');

		btSerial.findSerialPortChannel(address, function (channel) {
			btSerial.connect(address, channel, function () {
				console.log('connected');


				btSerial.on('finish', function () {
					console.log('finished triggered');
				});

			}, function () {
				console.log('cannot connect');
			});
		});
	}
});

router.get('/prototype1', function (req, res, next) {
	res.render("client-bluetooth", {
		title: 'protptype1'
	});
});

router.post('/led', function (req, res, next) {

	//btSerial.inquire();
	//btSerial.write(Buffer.from())
	let data = req.body;
	console.log(data);
	let message = {
		connected: true
	}

	res.send(JSON.stringify(message));
});


module.exports = router;

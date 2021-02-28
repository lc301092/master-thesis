const BTSP = require('bluetooth-serial-port');
const btSerial = new BTSP.BluetoothSerialPort();

const express = require('express');
const router = express.Router();

/* GET users listing. */
/// ### >>> DEL 1 <<< ###
router.get('/led', function (req, res, next) {

	btSerial.on('found', function (address, name) {

		// you might want to check the found address with the address of your
		// bluetooth enabled Arduino device here.
		if (name.toLowerCase().includes('hc')){
			console.log('>>> found device with address +' + address + ' and name: ' + name + ' <<<');

			btSerial.findSerialPortChannel(address, function (channel) {
				btSerial.connect(address, channel, function () {
					console.log('connected');
					process.stdin.resume();
					process.stdin.setEncoding('utf8');
					console.log('Press "1" or "0" and "ENTER" to turn on or off the light.')
					
					process.stdin.on('data', function (data) {
						btSerial.write(Buffer.from('data', 'utf-8'), function (err, bytesWritten) {
							console.log('bytes: ' + bytesWritten);
							if (err) console.log(err);
						});
					});
					
					btSerial.on('data', function (buffer) {
						console.log(buffer.toString('utf-8'));
					});
					
					btSerial.on('finish', function () {
						console.log('finished triggered');
					});
					
				}, function () {
					console.log('cannot connect');
				});
			});
		} 
	});

	btSerial.inquire();

	res.send("bluetooth led page");

});

/// ### >>> DEL 2 <<< ###

router.get('/exchange', function (req, res, next) {

	//Generic Error Handler for the BT Serial Port library as requires error functions
	const errFunction = (err) => {
		if (err) {
			console.log('Error', err);
		}
	};

	// Connecting to BT device can take a few seconds so a little console.log to keep you entertained.
	console.log("Starting Server");
	// Are you not entertained?

	/*
	  For this to work you will have to connect to the Bluetooth device on your computer in the normal way
	  I.e via Bluetooth settings: Default password is usually 0000 or 1234
	*/

	// Once BtSerial.inquire finds a device it will call this code
	// BtSerial.inquire will find all devices currently connected with your computer
	btSerial.on('found', function (address, name) {
		// If a device is found and the name contains 'HC' we will continue
		// This is so that it doesn't try to send data to all your other connected BT devices
		if (name.toLowerCase().includes('hc')) {

			btSerial.findSerialPortChannel(address, function (channel) {
				// Finds then btSerial port channel and then connects to it
				btSerial.connect(address, channel, function () {
					// Now the magic begins, bTSerial.on('data', callbackFunc) listens to the bluetooth device.
					// If any data is received from it the call back function is used
					btSerial.on('data', function (bufferData) {
						// The data is encoded so we convert it to a string using Nodes Buffer.from func
						console.log(Buffer.from(bufferData).toString());

						// Now we have received some data from the Arduino we talk to it.
						// We Create a Buffered string using Nodes Buffer.from function
						// It needs to be buffered so the entire string is sent together
						// We also add an escape character '\n' to the end of the string
						// This is so Arduino knows that we've sent everything we want
						btSerial.write(Buffer.from('From Node With Love\n'), errFunction);
					});
				}, errFunction);
			}, errFunction);
		} else {
			console.log('Not connecting to: ', name);
		}
	});

	// Starts looking for Bluetooth devices and calls the function btSerial.on('found'
	btSerial.inquire();

	res.send("bluetooth exchange page");

});

module.exports = router;

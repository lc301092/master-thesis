const BTSP = require('bluetooth-serial-port');
const serial = new BTSP.BluetoothSerialPort();

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

    serial.on('found', function (address, name) {

        // you might want to check the found address with the address of your
        // bluetooth enabled Arduino device here.

        serial.findSerialPortChannel(address, function (channel) {
            serial.connect(address, channel, function () {
                console.log('connected');
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                console.log('Press "1" or "0" and "ENTER" to turn on or off the light.')

                process.stdin.on('data', function (data) {
                    serial.write(data);
                });

                serial.on('data', function (data) {
                    console.log('Received: ' + data);
                });
            }, function () {
                console.log('cannot connect');
            });
        });
    });

    serial.inquire();

    res.send("bluetooth page");
});

module.exports = router;

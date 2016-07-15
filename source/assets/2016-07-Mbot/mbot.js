'use strict';

var MbotCusto = MbotCusto || function() {

    JefHelper.loadCss('/assets/2016-07-Mbot/mbot.css', 'mbotcss');

    var ChromeSamples = {
        log: function() {
            var line = Array.prototype.slice.call(arguments).map(function(argument) {
                return typeof argument === 'string' ? argument : JSON.stringify(argument);
            }).join(' ');

            document.querySelector('#log').textContent += line + '\n';
        },

        clearLog: function() {
            document.querySelector('#log').textContent = '';
        },

        setStatus: function(status) {
            document.querySelector('#status').textContent = status;
        },

        setContent: function(newContent) {
            var content = document.querySelector('#content');
            while (content.hasChildNodes()) {
                content.removeChild(content.lastChild);
            }
            content.appendChild(newContent);
        }
    };

    function onButtonClick() {
        log('Requesting any Bluetooth Device...');
        navigator.bluetooth.requestDevice({ filters: anyDevice(), optionalServices: ['device_information'] })
            .then(device => {
                log('Connecting to GATT Server...');
                return device.gatt.connect();
            })
            .then(server => {
                log('Getting Device Information Service...');
                return server.getPrimaryService('device_information');
            })
            .then(service => {
                log('Getting Device Information Characteristics...');
                return service.getCharacteristics();
            })
            .then(characteristics => {
                let queue = Promise.resolve();
                let decoder = new TextDecoder('utf-8');
                characteristics.forEach(characteristic => {
                    switch (characteristic.uuid) {

                        case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> Manufacturer Name String: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('model_number_string'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> Model Number String: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('hardware_revision_string'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> Hardware Revision String: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('firmware_revision_string'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> Firmware Revision String: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('software_revision_string'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> Software Revision String: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('system_id'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> System ID: ' + decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('ieee_11073-20601_regulatory_certification_data_list'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> IEEE 11073-20601 Regulatory Certification Data List: ' +
                                    decoder.decode(value));
                            });
                            break;

                        case BluetoothUUID.getCharacteristic('pnp_id'):
                            queue = queue.then(_ => characteristic.readValue()).then(value => {
                                log('> PnP ID:');
                                log('  > Vendor ID Source: ' +
                                    (value.getUint8(0) === 1 ? 'Bluetooth' : 'USB'));
                                log('  > Vendor ID: ' +
                                    (value.getUint8(1) | value.getUint8(2) << 8));
                                log('  > Product ID: ' +
                                    (value.getUint8(3) | value.getUint8(4) << 8));
                                log('  > Product Version: ' +
                                    (value.getUint8(5) | value.getUint8(6) << 8));
                            });
                            break;

                        default:
                            log('> Unknown Characteristic: ' + characteristic.uuid);
                    }
                });
                return queue;
            })
            .catch(error => {
                log('Argh! ' + error);
            });
    }

    /* Utils */

    function anyDevice() {
        // This is the closest we can get for now to get all devices.
        // https://github.com/WebBluetoothCG/web-bluetooth/issues/234
        return Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            .map(c => ({ namePrefix: c }))
            .concat({ name: '' });
    }

    document.querySelector('button').addEventListener('click', function() {
        if (isWebBluetoothEnabled()) {
            ChromeSamples.clearLog();
            onButtonClick();
        }
    });

    var log = ChromeSamples.log;

    function isWebBluetoothEnabled() {
        if (navigator.bluetooth) {
            return true;
        } else {
            ChromeSamples.setStatus('Web Bluetooth API is not available.\n' +
                'Please make sure the Web Bluetooth flag is enabled.');
            return false;
        }
    }

    return {}

}();

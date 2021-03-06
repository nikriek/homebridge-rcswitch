var rcswitch = require('rcswitch');
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  Accessory = homebridge.platformAccessory;

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  
  homebridge.registerAccessory("homebridge-rcswitch", "RCSwitch", RCSwitch);
}

function RCSwitch(log, config) {
  this.log = log;
  this.config = config;
  this.pin = config.pin['pin'] || 0;
  this.name = config['name'];
  this.groupId = config['group'];
  this.switchId = config['switch'];
  this.isOn = false;

  rcswitch.enableTransmit(this.pin);
}

RCSwitch.prototype.getServices = function() {
  let informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "RCSwitch")
    .setCharacteristic(Characteristic.Model, "RCSwitch")
    .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
  
  let switchService = new Service.Switch(this.name);

  switchService.getCharacteristic(Characteristic.On)
    .on('get', this.getSwitchOnCharacteristic.bind(this))
    .on('set', this.setSwitchOnCharacteristic.bind(this))

  return [informationService, switchService];
}

RCSwitch.prototype.getSwitchOnCharacteristic = function(next) {
  next(null, this.isOn);
}

RCSwitch.prototype.setSwitchOnCharacteristic = function(newState, next) {
  if (newState) {
    rcswitch.switchOn(this.groupId, this.switchId);
  } else {
    rcswitch.switchOff(this.groupId, this.switchId);
  }
  this.isOn = newState;
  next();
}

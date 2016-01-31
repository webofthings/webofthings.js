# Node.js Web of Things Gateway Embedded Framework
A gateway and server reference implementation of the [W3C Web Thing Model](http://model.webofthings.io),
written in Node.js and tailored for embedded devices.

## What is the Web Thing Model?
It's a simple model for Things to interact together and with app via the Web. Read more about
it in a [blogpost](http://radar.oreilly.com/2015/10/helping-things-in-the-iot-speak-the-same-language.html) or even more in a [webinar](https://www.oreilly.com/ideas/building-iot-systems-with-web-standards)!

## What is webofthings.js?
A simple, lightweight, and extensible implementation of the [W3C Web of Things Model](http://model.webofthings.io).
 in Node.js. It not (yet) a bomb proof gateway but a way to experiment with the Web of Things and the basis of the [Building the Web of Things book](https://www.manning.com/books/building-the-web-of-things?a_bid=16f48f14&a_aid=wot) 
where you'll learn how the framework works, how to deploy it on a Raspberry Pi and how to use it to serve Web access to sensors 
and actuators.

## What does this do?
First, it implements a Web of Things server that you can run on any platform that supports Node. 
Second, it exposes the services and function of your service over HTTP and WebSockets.

## What devices does it support?

Any Windows or *Nix device really but if you want to use the GPIOs you will need an embedded device.
The framework was tested on the Raspberry Pi (A, B, B+, Zero and 2) and the Beaglebone Black.
Most of the code also works on the Intel Edison.

## How is it built?
![application architecture](https://raw.githubusercontent.com/webofthings/webofthings.js/master/docs/webofthingsjs-archi.png)

## How do I start it?

Install it: `npm install`

Run it: `node wot.js` or `sudo node wot.js` if you plan to use the temperature and humidity plugins.

## How do I configure it?

The WoT gateway can be tweaked by changing the configuration parameters in `/resources/piNoLd.json`.
The following parameters are available:

```
  "customFields": {
    "hostname":"localhost",
    "port": 8484,
    "secure": true, // true means the gateway will require HTTPS and an API key
    "dataArraySize" : 30 // size of the Properties and Actions arrays.
  },
```

If you use it in a serious environment make sure you:

1. Generate/buy your own TLS certificates to replace the public certificate and private key in `/resources`.
2. Make sure you generate a new API token to replace the default one (`cKXRTaRylYWQiF3MICaKndG4WJMcVLFz`) in
`/resources/auth.json`, you can use the `utils.generateApiToken()` function to generate a new one.

## How do I extend it?

The WoT Gateway framework comes with three internal plugins to connect it to sensors and actuators:

* `dht22Plugin.js` to connect a temperature and humidity sensor
* `ledsPlugin.js` to connect it to LEDs
* `pirPlugin.js` to connect it to a passive infrared sensor

but it can easily be extended by adding internal or external plugins (i.e., to serve the resources
of other devices via a Web API) extending `corePlugin.js`.

### How do I run the tests?

1. Install mocha `npm install -g mocha`
2. Run the tests `mocha`

## How do I learn more about the Web of Things?
Browse http://webofthings.org and/or buy the [Building the Web of Things Book](http://book.webofthings.io)

![building the web of things](https://raw.githubusercontent.com/webofthings/webofthings.js/master/docs/building-the-web-of-things.png)

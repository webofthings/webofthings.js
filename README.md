# Web of Things Gateway Framework
A gateway and server reference implementation of the [Web of Things Model](http://model.webofthings.io).

## What is it?
A very simple, lightweight, and extensible implementation of the Web Things Model in Node.js. 
It not (yet) a bomb proof gateway but a way to discover the Web of Things and the basis of the [Building the Web of Things book](https://www.manning.com/books/building-the-web-of-things?a_bid=16f48f14&a_aid=wot) 
where you'll learn how the framework works, how to deploy it on a Raspberry Pi and how to use it to serve Web access to sensors 
and actuators.

## Why does this do?
First, it implements a Web of Things server that you can run on any platform that supports Node. 
Second, it exposes the services and function of your service over HTTP and WebSockets.

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

## Want to know more about the Web of Things?
Browse http://webofthings.org and/or buy the [Building the Web of Things Book](http://book.webofthings.io)

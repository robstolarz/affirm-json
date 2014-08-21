affirm-json
===========

JSON Validator.

It validates JSONs based on schemas. Require `src/validator.js`.

##Differences from [JSON Schema](http://json-schema.org/)

* max/min of any object are simply referred to as `max` and `min`; no more Items/Length/imums
* Extra properties error by default
* Dates are a native object that are also validated; they can be strings in whatever date format your JS engine supports. If you're not using ISO strings in the format of `'Tue Dec 24 1996 00:00:00 GMT-0500 (EST)'`, you may want to try [moment.js](http://momentjs.com/)
* You must use `try-catch` block to catch Errors; single primitives return messages in `errorObject.message` while 
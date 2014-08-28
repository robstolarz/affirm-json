affirm-json
===========

JSON Validator.

It validates JSONs based on schemas. Require `src/validator.js`.

##Features
It can validate:

 * Numbers (and Integers specifically)
  * In range
 * Strings 
  * Length
  * (Planned) Regex support
 * Arrays
  * Length
  * Uniqueness
 * Objects
  * Extra properties
  * Required properties
 * Dates
  * Validity
  * In range


##Differences from [JSON Schema](http://json-schema.org/)

* max/min of any object are simply referred to as `max` and `min`; no more Items/Length/imums
* Extra properties error by default
* You must use `try-catch` block to catch Errors; single primitives return messages in `errorObject.message` while more complex objects return Error-containing Objects directly
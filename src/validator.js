var basefuncs = {
  object:function(object,schema,indent){
    if(!schema.properties || schema.properties.length < 1)throw new Error("No properties defined");
    
    var requireds = schema.required || [] //make a list
    , errs = {};
    
    for (var prop in object) {
      if(object.hasOwnProperty(prop)){
        console.log(Array(indent+1).join(" ")+"Validating "+prop);
        if(!schema.properties[prop]) throw new Error("Encountered property not in schema: "+prop)
        try {
          Validator.validateObject(object[prop],schema.properties[prop],indent+1);
        } catch (e){
          e=e.message||e; //because Error and other things are weird
          errs[prop] = e;
        }
        var i = requireds.indexOf(prop);
        if (i != -1)
          requireds.splice(i, 1);
      }
    }
    
    
    //are there still items left?
    if(requireds.length > 0) throw new Error("Missing required fields: "+requireds.join());
    
    if(Object.keys(errs).length !== 0){
      throw errs;
    }
  },
  string:function(object,schema){
    if(object.length > schema.maxLength) throw new Error("String too long"); //takes advantage of undefined comparisons always false
    if(object.length < schema.minLength) throw new Error("String too short");
  },
  number:function(object,schema){
    if(object > schema.maximum) throw new Error("Number too big");
    if(object < schema.minimum) throw new Error("Number too small");
  },
  enum:function(object,schema){
    //indexOf returns -1 when object not found
    if(schema.enum.indexOf(object)==-1) throw new Error("Object not in enum: "+object);
  },
  array:function(object,schema,indent){
    if(object.length > schema.maxItems) throw new Error("Too many items");
    if(object.length < schema.minItems) throw new Error("Too few items");
    var errs = {};
    object.forEach(function(v,i){
      console.log(Array(indent+1).join(" ")+"Validating index "+i);
      try {
        Validator.validateObject(object[i],schema.items,indent+1);
      } catch(e){
        e=e.message||e;
        errs[i] = e;
      }
    });
    /*if(schema.uniqueItems && object.filter( //only works on array of primitives
      function(value, index, self) { 
        return self.indexOf(value) == index;
      }
    ).length != object.length) throw new Error("Items are not unique");*/
    if(Object.keys(errs).length !== 0){
      throw errs;
    }
  },
  date:function(object,schema){ //borrowed from http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    object = new Date(object);
    if(Object.prototype.toString.call(object) !== "[object Date]") throw new Error("Couldn't convert to a real Date object");
    if(isNaN(object.getTime())) throw new Error("Invalid date");
  }
  
};

var aliases = {
  integer:function(object,schema){
    basefuncs.number(object,schema);
    if(object % 1 != 0) throw new Error("Object is decimal where integer was expected");
  }
}

for (var attrname in aliases) { basefuncs[attrname] = aliases[attrname]; }

var typefuncs = basefuncs;

Validator = {};

Validator.validateObject = function(object,schema,indent){
  typefuncs[schema.type||(schema.enum?'enum':null)](object,schema,indent||0);
};

module.exports = Validator;
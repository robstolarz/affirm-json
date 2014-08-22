//Hey there! This tiny validator's licensed under the LGPL 2.1.
//Contribute what you change *in this code only* and you'll likely be following the rules.
//Check LICENSE for more details.
//Attribution's nice but not necessary.

function rEq(obj1,obj2){
  if(obj1 instanceof Array){
    if(obj1.length != obj2.length)return false;
    var ok=true;
    for(var i=0;i<obj1.length||!ok;++i){
      for(var j=0,ok=false;j<obj1.length;++j)
        if(rEq(obj1[i],obj2[j%obj2.length])){
          ok = true;
          break;
        }
    }
    return ok;
  }
  if(typeof obj1 === 'object'){
    if(obj1===null)return obj1===obj2;
    for(prop in obj1) //assuming both objs have same properties
      if(obj1.hasOwnProperty(prop))
        if(!rEq(obj1[prop],obj2[prop]))
          return false;
    return true;
  }
  return obj1===obj2;
}

//utility function to stringbuild
function compareBetween(what,obj,schema){
  var min = schema.min,
    max = schema.max,
    obj = obj.length||obj; //for strings, arrays
  if(obj > max || obj < min) //must be (between min/max)||(greater/less than min/max)
    throw new Error( 
      (what||"Something")+
      " must be "+
      (
        (min&&max)? //both?
          "between "+min+" and "+max:          
          (max? //not checking for either because it's both or either at this point
            "less ":
            "greater "
          )+"than or equal to "+(min||max)
      )+" but is "+obj
    );
}

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
  string:compareBetween.bind(3,"String length"), 
  number:compareBetween.bind(3,"Number"),//in addition to being the loneliest number, 3 is also the shortest primitive
  enum:function(object,schema){
    //indexOf returns -1 when object not found
    if(schema.enum.indexOf(object)==-1) throw new Error("Object not in enum: "+object);
  },
  array:function(object,schema,indent){
    compareBetween("Array length",object,schema);
    var errs = {};
    object.forEach(function(v,i){
      console.log(Array(indent+1).join(" ")+"Validating index "+i);
      try {
        Validator.validateObject(object[i],schema.items,indent+1);
        // unique item validation
        if(schema.uniqueItems){
          var a = {};
          for(var j=0;j<object.length;++j)
            if(i!=j && rEq(v,object[j]))
              a[i] = "Object matches another at index "+j;
          if(Object.keys(a).length !== 0){
            throw a;
          }
        }
        
      } catch(e){
        e=e.message||e;
        errs[i] = e;
      }
    });
          
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

var aliases = { //functions that depend on a validator but extend it
  integer:function(object,schema){
    if(object % 1 != 0) throw new Error("Object is decimal where integer was expected");
    basefuncs.number(object,schema);
  }
}

//copy functions
for (var attrname in aliases) { basefuncs[attrname] = aliases[attrname]; }

var typefuncs = basefuncs;

//build module
Validator = {};

Validator.validateObject = function(object,schema,indent){
  typefuncs[schema.type||(schema.enum?'enum':null)](object,schema,indent||0);
};

Validator.recursiveEquals = rEq;

module.exports = Validator;

/*

    affirm-json, a really tiny JSON validator
    Copyright (C) 2014 Robert Stolarz

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
    USA
    
*/

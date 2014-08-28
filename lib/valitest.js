var testSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Task Schema",
  "type": "object",
  "additionalProperties": false,
  "required": ["task", "status"],
  "properties": {
    "task": {
      "type": "string",
      "description": "The task",
      "max": 4000,
      "default": ""
    },
    "status": {
      "enum": ["not completed", "completed", "on hold"],
      "description": "Three options in string format to describe status of the task",
      "default": "not completed"
    },
    "list": {
      "type": "string",
      "description": "The list this task belongs to",
      "max": 300,
      "default": ""
    },
    "parent_task": {
      "type": "string",
      "description": "ID of another task that this task belongs to",
      "max": 100,
      "default": ""
    },
    "category": {
      "type": "string",
      "description": "Category for the task",
      "max": 50,
      "default": ""
    },
    "due_date": {
      "type": "string",
      "format":"date-time",
      "description": "Date and time the task is due in ISO 8601 date standard e.g. YYYY-MM-DDThh:mm:ss.sTZD",
      "default": "",
      "max":"Mon Jan 01 2001 00:00:00 GMT-0500 (EST)"
    },
    "priority_level": {
      "type": "integer",
      "description": "Priority level.  5 being the most important",
      "min": 1,
      "max": 5,
      "default": 1
    },
    "percentage_completed": {
      "type": "integer",
      "description": "Number out of 100 to represent how much of this task has been completed",
      "min": 0,
      "max": 100,
      "default": 0
    },
    "asignees": {
      "type": "array",
      "description": "People whom this task has been assigned to",
      "uniqueItems": true,
      "additionalItems": false,
      "max": 30,
      "default": [],
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "asignee": {
            "type": "string",
            "description": "Person or entity to whom the task is assigned to",
            "default": ""
          }
        }
      }
    }
  }
},
task = {
  task:"Eat cake",
  priority_level:0,
  status:"not completed",
  asignees:[{asignee:"Bro McGeester"},{asignee:"Alexis LaSalle"},{asignee:"Alexis LaSalle"},{cake:"oranges"}],
  due_date:"Tue Aug 19 2014 00:17:03 GMT-0400 (EDT)"
}; //todo: recursively unique objects

try {
  require('../src/validator.js').validateObject(task,testSchema);
} catch (e) {
  e=e.message||e;
  console.log(JSON.stringify(e));
}
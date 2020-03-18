# Treasure-Hunt-Game

## How to run the poject:

```pull the project from the branch logic-implementation ```

1. Run the command : `npm install` in the terminal.
2. Run the command : `npm run server:watch` in the terminal in order to start the server on the localhost:3005
3. Split the terminal and run the command: `npm start` in order to start React app on client

## Usage of endpoints:

### Create User

- type: POST

- url: localhost:3005/user

```
example content in a body:
{
      "name":"Katarzyna"
}
```

- valid response: object with the newly created user with the scores empty array and movements properties

### Make a move

- type: POST

- url: localhost:3005/user/move

```
example content in a body:

{
    "name": "Katarzyna",
    "movements": [
    	{"x":4,"y":1},
    	{"x":2,"y":2},
    	{"x":0,"y":1}],

   "treasureMap":[
        {"x":0, "y": 0, "value": "" },
        {"x":0, "y": 1, "value": "" },
        {"x":0, "y": 2, "value": ""  },
        {"x":0,"y": 3, "value": ""  },
        {"x":0, "y": 4, "value": "" },
        {"x":1, "y": 0, "value": "" },
        {"x":1, "y": 4, "value": ""  },
        {"x":2 ,"y": 0, "value": ""  },
        {"x":2, "y": 1, "value": ""  },
        {"x":2, "y": 2," value": ""  },
        {"x":2, "y": 2, "value":""  },
        {"x":4, "y": 2, "value": ""  }
    ]
}

```

```
* valid response:
[
    {
        "positionY": 1,
        "positionX": 4,
        "value": "1"
    },
    {
        "positionY": 2,
        "positionX": 2,
        "value": "1"
    },
    {
        "positionY": 1,
        "positionX": 0,
        "value": "1"
    }
]
```

### Get Top 10 results

- type: Get

- url: localhost:3005/score/top/:name

```
example url with the defined name:

      localhost:3005/user/Katarzyna

```

- valid response: array of the sorted values in the scores array property

```
[]
```

### Update User's scores

- type: Put

- url: localhost:3005/user/score

```
example content in a body:

{
    {
	"name":"Katarzyna",
	"score":"4"
}

```

- valid response:

```
{
    "name": "Katarzyna",
    "scores": [
        "4"
    ],
    "movements": []
}
```

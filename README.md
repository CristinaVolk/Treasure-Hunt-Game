# Treasure-Hunt-Game

## How to run the poject:

`pull the project from the branch logic-implementation`

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

- valid response: Created

### Make a move

- type: POST

- url: localhost:3005/user/move

```
example content in a body:

{
    "name": "Katarzyna",

    "movements": [
        { "positionX": 1, "positionY": 4, "value": 1 },
        { "positionX": 1, "positionY": 3, "value": 1 },
        { "positionX": 1, "positionY": 2, "value": 1 }
    ],

 "treasureMap": [
        { "positionX": 0, "positionY": 0, "value": "" },
        { "positionX": 0, "positionY": 1, "value": "" },
        { "positionX": 0, "positionY": 2, "value": "" },
        { "positionX": 0, "positionY": 3, "value": "" },
        { "positionX": 0, "positionY": 4, "value": "" },
        { "positionX": 1, "positionY": 0, "value": "" },
        { "positionX": 1, "positionY": 1, "value": "" },
        { "positionX": 1, "positionY": 2, "value": "" },
        { "positionX": 1, "positionY": 3, "value": "" },
        { "positionX": 1, "positionY": 4, "value": "" },
        { "positionX": 2, "positionY": 0, "value": "" },
        { "positionX": 2, "positionY": 1, "value": "" },
        { "positionX": 2, "positionY": 2, "value": "" },
        { "positionX": 2, "positionY": 3, "value": "" },
        { "positionX": 2, "positionY": 4, "value": "" },
        { "positionX": 3, "positionY": 0, "value": "" },
        { "positionX": 3, "positionY": 1, "value": "" },
        { "positionX": 3, "positionY": 2, "value": "" },
        { "positionX": 3, "positionY": 3, "value": "" },
        { "positionX": 3, "positionY": 4, "value": "" },
        { "positionX": 4, "positionY": 0, "value": "" },
        { "positionX": 4, "positionY": 1, "value": "" },
        { "positionX": 4, "positionY": 2, "value": "" },
        { "positionX": 4, "positionY": 3, "value": "" },
        { "positionX": 4, "positionY": 4, "value": "" }
    ],

  "treasures": [
        { "positionX": 4, "positionY": 0 },
        { "positionX": 4, "positionY": 3 },
        { "positionX": 4, "positionY": 2 }
    ]
}

```

```
* valid response:
[
    {
        "positionX": 1,
        "positionY": 4,
        "value": "1"
    },
    {
        "positionX": 1,
        "positionY": 3,
        "value": "1"
    },
    {
        "positionX": 1,
        "positionY": 2,
        "value": "1"
    }
]
```

### Get Top 10 results

- type: Get

- url: localhost:3005/scores/top/:name

```
example url with the defined name:

      http://localhost:3005/scores/top/Katarzyna

```

- valid response: array of the sorted values in the scores array property

```
[
    "4"
]
```

### Update User's scores

- type: Put

- url: localhost:3005/user/score

```
example content in a body:

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
    "movements": [
        {
            "positionX": 1,
            "positionY": 4,
            "value": "1"
        },
        {
            "positionX": 1,
            "positionY": 3,
            "value": "1"
        },
        {
            "positionX": 1,
            "positionY": 2,
            "value": "1"
        }
    ]
}
```

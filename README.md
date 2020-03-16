# Treasure-Hunt-Game

## How to run the poject:

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
      "name":"Janett"
}
```

- valid response: object with the newly created user with the scores empty array and movements properties

### Make a move

- type: POST

- url: localhost:3005/user/move

```
example content in a body:
{
    "name": "kris",
    "movements": [
    	{"x":4,"y":1},
    	{"x":2,"y":2},
    	{"x":0,"y":1}
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

      localhost:3005/user/Janett

```

- valid response: array of the sorted values in the scores array property

```
[2,3,3,3,4,4,4,6,6,7]
```

### Get User

- type: Get

- url: localhost:3005/user/:name

```
example url with the defined name:

      localhost:3005/user/Janett

```

- valid response:

```
{
    "name": "Janett",
    "scores": [],
    "movements": []
}
```

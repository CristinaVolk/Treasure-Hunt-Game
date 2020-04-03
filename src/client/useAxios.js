const axios = require("axios");

const createUser = userName =>
{
  return axios.post( "http://localhost:3005/user", { name: userName } )
      .then( result => result.status)
      .catch( error => console.error( error ) );
}


const updateUserScore = ( name, score ) =>
{
  return axios.put( `http://localhost:3005/user/score`, {
      name: name,
      score: score
  } )
    .then( result => result )
    .catch ( error => console.error( error ) );
}

const MakeUserMove = ( config ) =>
{
  return axios.post( `http://localhost:3005/user/move`, config )
    .then( result => result )
    .catch( error => console.error( error ) );
}

const fetchScore = userName =>
{
  return axios.get( `http://localhost:3005/scores/top/${ userName }` )
    .then( result => result.data)
    .catch( error => console.error( error ) );
}


module.exports = {
  createUser,
  updateUserScore,
  MakeUserMove,
  fetchScore
};

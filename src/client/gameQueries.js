const axios = require("axios");
const HOST = `http://localhost:3005`;
const createUser = userName =>
{
  return axios.post( `${HOST}/user`, { name: userName } )
      .then( result => result.status)
      .catch( error => console.error( error ) );
}


const updateUserScore = ( name, score ) =>
{
  return axios.put( `${HOST}/user/score`, {
      name: name,
      score: score
  } )
    .then( result => result )
    .catch ( error => console.error( error ) );
}

const makeUserMove = ( config ) =>
{
  return axios.post( `${ HOST}/user/move`, config )
    .then( result => result )
    .catch( error => console.error( error ) );
}

const fetchScore = userName =>
{
  return axios.get( `${ HOST}/scores/top/${ userName }` )
    .then( result => result.data)
    .catch( error => console.error( error ) );
}


module.exports = {
  createUser,
  updateUserScore,
  makeUserMove,
  fetchScore
};

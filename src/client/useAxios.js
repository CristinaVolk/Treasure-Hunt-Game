const axios = require("axios");

const createUser = userName =>
{
  try
  {
    let status = axios.post( "http://localhost:3005/user", { name: userName } )
      .then( result =>
      {
        console.log( result.status );
        return result.status;
      } );
    return status
  } catch(error ) {console.log(error)}
} 


const updateUserScore = ( name, score ) =>
{
  try
  {
    let status = axios.put( `http://localhost:3005/user/score`, {
      name: name,
      score: score
    } ).then( result =>
      {
        console.log( result);
        return result;
      } );
    return status
  } catch(error ) {console.log(error)}
}


const MakeUserMove = ( name, movements, treasureMap, treasures) =>
{
  try
  {
    let status = axios.post( `http://localhost:3005/user/move`, { name: name, movements: movements, treasureMap: treasureMap, treasures: treasures } ).then( result =>
    {
      console.log( result );
      return result;
    } );
    return status;
  } catch ( error ) { console.log( error ); }
}


const fetchScore = userName =>
{
  try
  {
    let response = axios.get( `http://localhost:3005/scores/top/${ userName }` )
      .then( result =>
      {
        console.log( result.data );
        return result.data;
      })
      return response
  } catch ( error ) { console.log( error ); }
} 


module.exports = {
  createUser,
  updateUserScore,
  MakeUserMove,
  fetchScore
};

import { post, put, get } from 'axios';

const HOST = 'http://localhost:3005';
const createUser = (userName) => {
  return post(`${HOST}/user`, { name: userName })
    .then((result) => result.data.user)
    .catch((error) => console.error(error));
};

const updateUserScore = (name, score) => {
  return put(`${HOST}/user/score`, {
    name,
    score,
  })
    .then((result) => result)
    .catch((error) => console.error(error));
};

const makeUserMove = (config) => {
  return post(`${HOST}/user/move`, config)
    .then((result) => result)
    .catch((error) => console.error(error));
};

const fetchScore = (userName) => {
  return get(`${HOST}/scores/top/${userName}`)
    .then((result) => result.data)
    .catch((error) => console.error(error));
};

// eslint-disable-next-line import/prefer-default-export
export const gameQueries = {
  createUser,
  updateUserScore,
  makeUserMove,
  fetchScore,
};

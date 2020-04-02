const axios = require("axios");

const createUser = userName => {
  axios
    .post("http://localhost:3005/user", {
      name: userName
    })
    .then(responseData => {
      let responseStatus = responseData.status;
      console.log("res", responseStatus);

      return responseStatus;
    });
};

module.exports = {
  createUser
};

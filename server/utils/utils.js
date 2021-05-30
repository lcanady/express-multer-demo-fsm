const jwt = require("jsonwebtoken");

module.exports.sign = (id, secret) =>
  new Promise((resolve, reject) =>
    jwt.sign({ id }, secret, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    })
  );

module.exports.verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.SECRET, (err, data) => {
      if (err) reject(err);
      resolve(data.id);
    })
  );

import { client } from '../index.js';

export async function hashpass(email,firstname,lastname,username, hashpassword) {
  return await client
    .db("bookmyshowpass")
    .collection("bookmyshowpass")
    .insertOne({
      firstname:firstname,
      lastname:lastname,
      username: username,
      password: hashpassword ,
      email:email
    });
}

export async function getuserbyname(username) {
    return await client
      .db("bookmyshowpass")
      .collection("bookmyshowpass")
      .findOne({
        username: username
      });
  }

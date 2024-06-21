// script.js
import CONFIG from "./config.js";

// Use credentials from the CONFIG object
const username = CONFIG.username;
const password = CONFIG.password;
const credentials = `${username}:${password}`;
const encodedCredentials = btoa(credentials);

let patients_data = [];

window.onload = async function () {
  await getPatientData();
};

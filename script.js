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

async function getPatientData() {
  await fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
    method: "GET",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const jessicaData = data.find(
        (patient) => patient.name === "Jessica Taylor"
      );
      if (jessicaData) {
        setData(jessicaData);
        createBloodPressureChart(jessicaData);
        setBPCount(jessicaData);
        setHealthStatus(jessicaData);
        setDiagnosticList(jessicaData);
        setPatientInfo(jessicaData);
        setLabResults(jessicaData);
      } else {
        console.error("Jessica Taylor not found");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function setData(data) {
  patients_data = data;
  const patients_list = document.querySelector(".patients_list");
  patients_list.innerHTML = `
    <div class="patient">
        <img src="${data.profile_picture}" alt="Avatar" />
        <div class="patient_demographics">
            <p class="name">${data.name}</p>
            <p class="gender">${data.gender}, ${data.age}</p>
        </div>
    </div>
    <div>
        <i class="material-icons">more_horiz</i>
     </div>
    `;
}

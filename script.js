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

function createBloodPressureChart(patientData) {
  // Extract blood pressure readings for Chart.js
  const labels = patientData.diagnosis_history.map(
    (diagnosis) => `${diagnosis.month} ${diagnosis.year}`
  );
  const systolicReadings = patientData.diagnosis_history.map(
    (diagnosis) => diagnosis.blood_pressure.systolic.value
  );
  const diastolicReadings = patientData.diagnosis_history.map(
    (diagnosis) => diagnosis.blood_pressure.diastolic.value
  );

  // Create the datasets for the chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Systolic",
        data: systolicReadings,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        yAxisID: "y",
      },
      {
        label: "Diastolic",
        data: diastolicReadings,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  // Define chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Blood Pressure (mmHg)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Blood Pressure Over Time",
        align: "start",
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 160,
            yMax: 160,
            borderColor: "rgba(255, 99, 132, 0.5)",
            borderWidth: 1,
            label: {
              content: "Higher than Average",
              enabled: true,
              position: "end",
            },
          },
          line2: {
            type: "line",
            yMin: 78,
            yMax: 78,
            borderColor: "rgba(54, 162, 235, 0.5)",
            borderWidth: 1,
            label: {
              content: "Lower than Average",
              enabled: true,
              position: "end",
            },
          },
        },
      },
    },
  };

  // Get context and create Chart
  const ctx = document.getElementById("bloodPressureChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: chartData,
    options: chartOptions,
  });
}

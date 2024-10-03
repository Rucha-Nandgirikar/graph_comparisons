import { 
    getTableData,
    checkAnswer,
} from "./mainstudy.js";

import { 
    getUserID,
    recordInteraction,
    recordPrestudyResponse,
    prestudyQuestions,
} from "./prestudy.js"

//main study elements
const studyContent = document.getElementById("study-content");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-button");
const prestudyNotif = document.getElementById("prestudy-notif");
const beginStudyButton = document.getElementById("begin-study-button");
const beginMainStudyButton = document.getElementById("begin-main-study-button");

//welcome screen or home screen
const homeContent = document.getElementById("home-content");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");
const postStudyCongrats = document.getElementById("congrats-cat");

//prestudy elements
const beginPrestudyButton = document.getElementById("begin-prestudy-button");
const chartPlaceholder = document.getElementById("chart");
const prestudyContent = document.getElementById("prestudy");
const prestudyQuestionElement = document.getElementById("prestudy-question");
const prestudySubmitButton = document.getElementById("prestudy-submit-button");
const startCalibrationButton = document.getElementById("start-calibration-button");
const prestudyMsgElement = document.getElementById("prestudy-msg");
const calibrationScreen = document.getElementById("calibration-screen");
const prestudyChart = document.getElementById("prestudy-chart");
const inputElement = document.getElementById("inputText");

// Prestudy Variables
let currentPrestudyQuestionIndex = 0;
let currentQuestion = { value: "" };
let currentAnswer = { value: null };

// Mainstudy Variables
let userId;
let currentQuestionId;
let currentQuestionIndex = 0; 
let currentCorrectAnswer;
let data2DArray = []; //stores all queries from test_questions in database locally

// initial page setup
init();

// Add event listeners
submitButton.addEventListener("click", () => {
    checkAnswer(currentQuestionId, currentCorrectAnswer);
    recordInteraction(userId, "Submit", true, false, currentQuestionId, currentAnswer);
});
  
beginPrestudyButton.addEventListener("click", () => {
    recordInteraction(userId, "Begin Prestudy", false, false, currentQuestionId, currentAnswer);
    homeContent.style.display = "none";

    // Ignore prestudy for dev purposes
    displayPrestudyQuestions(prestudyQuestions); 
    //beginMainStudy(); 
});
  
claimUserIDButton.addEventListener("click", async () => {
    const userId = await getUserID();
    setUserID(userId);
});
  
beginStudyButton.addEventListener("click", () => {
    // recordInteraction(userId, "Begin Study", false, false, currentQuestionId, currentAnswer);
    homeContent.style.display = "block";
    beginStudyButton.style.display = "none";
});
  
beginMainStudyButton.addEventListener("click", () => {
    recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentAnswer);
    beginMainStudy(); 
});

//Record prestudy response and user click when prestudySubmitButton is clicked in prestudy_responses
prestudySubmitButton.addEventListener("click", () => {
    const inputValue = inputElement.value;
    if (!inputValue) {
      alert("Please enter an answer.");
      currentAnswer.value = null;
      return;
    } else {
      currentAnswer.value = inputValue;
    }
  
    recordPrestudyResponse(userId, currentQuestion, currentAnswer);
    inputElement.value = "";

    displayPrestudyQuestions(prestudyQuestions);
    recordInteraction(userId, "Submit", false, true, currentQuestionId, currentAnswer);
});
  
  //records user click, hides prestudy content, displays calibration screen, and hides calibration
  //screen while starting main study (after 5 seconds) when beginButton is clicked
  startCalibrationButton.addEventListener("click", () => {
    recordInteraction(userId, "Start Calibration", false, false, currentQuestionId, currentAnswer);
    prestudyContent.style.display = "none";
    calibrationScreen.style.display = "block";
    setTimeout(() => {
      beginMainStudyButton.style.display = "block";
      calibrationScreen.style.display = "none";
    }, 5000);
});

// Initially, show the welcome message and hide the study content
function init(){
    homeContent.style.display = "none";
    studyContent.style.display = "none";
    prestudyContent.style.display = "none";
}

function displayPrestudyQuestions(questions) {
    prestudyContent.style.display = "block";
    prestudySubmitButton.style.display = "block";
    startCalibrationButton.style.display = "none";
    
    if (currentPrestudyQuestionIndex < 6) {
      prestudyQuestionElement.innerHTML = currentQuestion.value =
        questions[currentPrestudyQuestionIndex][0];
      prestudyChart.innerHTML = "";
    
      var imageElement = document.createElement("img");
      if (questions[currentPrestudyQuestionIndex][1] != null) {
        imageElement.src =
          "img/prestudy-img/" + questions[currentPrestudyQuestionIndex][1];
        imageElement.alt = "prestudy Chart";
        imageElement.style.width = "auto";
        imageElement.style.height = "400px";
        prestudyChart.appendChild(imageElement);
      }
    } else {
      // Survey is complete
      startCalibrationButton.style.display = "block";
      prestudyMsgElement.textContent =
        "Prestudy completed! When you click NEXT, you will be shown a blank screen with a tiny plus sign at the center, please focus your eyes on it for 5 seconds. ";
      prestudyQuestionElement.innerHTML = "";
      prestudySubmitButton.style.display = "none";
      currentPrestudyQuestionIndex = 0;
      prestudyChart.innerHTML = "";
      inputElement.style.display = "none";
    }
}

function displayMyEquityGapsComparisonData()
{
  const url = "https://studentresearch.dashboards.calstate.edu/api/equity-gaps/my-equity-gaps/comparison-data";
    const params = {
      'campus': "*CSU System",
      'college': "School of Arts & Humanities",
      'major': "*All Majors",
      'student_type': "freshmen",
      'student_type_name': "Freshmen",
      'cohort': 2019,
      'persistence': 1,
      'year1': 4,
      'year2': 6,
      'outcome': "6th-Year Graduation",
      'gap_type': "firstgen",
    };

    // Construct the query string from the parameters
    const queryString = new URLSearchParams(params).toString();

    // Append the query string to the URL
    const fullUrl = `${url}?${queryString}`;
  
    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        // Extracting the data to plot
        const labels = data.non.map(item => item[0]);  // Extract years
        const ingroupData = data.areadata.map(item => item.ingroup);  // Ingroup values
        const outgroupData = data.areadata.map(item => item.outgroup);  // Outgroup values

        // Create a canvas element for Chart.js
        const canvasElement = document.createElement("canvas");
        canvasElement.id = "myChart";
        canvasElement.width = 400;  // Set width (optional)
        canvasElement.height = 500; // Set height (optional)
        chartPlaceholder.appendChild(canvasElement);

        // Get the 2D drawing context of the canvas
        const ctx = canvasElement.getContext('2d');

        // Initialize the Chart.js chart
        const myChart = new Chart(ctx, {
          type: 'line', // Example chart type
          data: {
            labels: labels,
            datasets: [
              {
                label: 'First-Generation',
                data: ingroupData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
              },
              {
                label: 'Not First-Generation',
                data: outgroupData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: false,
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

function displayMyEquityGapsMajorGaps()
{
  const url1 = "https://studentresearch.dashboards.calstate.edu/api/equity-gaps/my-equity-gaps/major-gaps";
    const params1 = {
      'campus': "*CSU System",
      'student_type': "freshmen",
      'outcome': "6th-Year Graduation",
      'gap_type': "firstgen",
    };
     // Construct the query string from the parameters
     const queryString1 = new URLSearchParams(params1).toString();

     // Append the query string to the URL
     const fullUrl1 = `${url1}?${queryString1}`;
   
     fetch(fullUrl1, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json'
       }
     })
       .then(response => response.json())
       .then(data => {
          console.log('Data:', data);

          const canvasElementMajorAtEntry = document.createElement("canvas");
          canvasElementMajorAtEntry.id = "majorAtEntryChart";
          canvasElementMajorAtEntry.width = 200;  // Set width (optional)
          canvasElementMajorAtEntry.height = 250; // Set height (optional)
          chartPlaceholder.appendChild(canvasElementMajorAtEntry);
    
          const canvasElementLastMajorHeld = document.createElement("canvas");
          canvasElementLastMajorHeld.id = "lastMajorHeldChart";
          canvasElementLastMajorHeld.width = 200;  // Set width (optional)
          canvasElementLastMajorHeld.height = 250; // Set height (optional)
          chartPlaceholder.appendChild(canvasElementLastMajorHeld);

          // Extract data for "Major At Entry"
          const majorAtEntryLabels = [data[0].major1, data[0].major2, data[0].major3, data[0].major4, data[0].major5];
          const majorAtEntryData = [data[0].n_major1_addtl, data[0].n_major2_addtl, data[0].n_major3_addtl, data[0].n_major4_addtl, data[0].n_major5_addtl];

          // Extract data for "Last Major Held"
          const lastMajorHeldLabels = [data[1].major1, data[1].major2, data[1].major3, data[1].major4, data[1].major5];
          const lastMajorHeldData = [data[1].n_major1_addtl, data[1].n_major2_addtl, data[1].n_major3_addtl, data[1].n_major4_addtl, data[1].n_major5_addtl];

          // Plot "Major At Entry" Bar Chart
          const ctx1 = document.getElementById('majorAtEntryChart').getContext('2d');
          new Chart(ctx1, {
              type: 'bar',
              data: {
                  labels: majorAtEntryLabels,
                  datasets: [{
                      label: 'Number of Students',
                      data: majorAtEntryData,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });

          // Plot "Last Major Held" Bar Chart
          const ctx2 = document.getElementById('lastMajorHeldChart').getContext('2d');
          new Chart(ctx2, {
              type: 'bar',
              data: {
                  labels: lastMajorHeldLabels,
                  datasets: [{
                      label: 'Number of Students',
                      data: lastMajorHeldData,
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
       })
       .catch((error) => {
         console.error('Error:', error);
       });
    
}

function displayStudentProgressUnits()
{
  // student-progress-units
  // const url = "https://studentresearch.dashboards.calstate.edu/api/faculty-dashboard/student-progress-units/what-paths-do-they-follow/chart-data";
    // const params = {
    //   'campus': "*CSU System",
    //   'college': "School of Arts & Humanities",
    //   'major': "*All Majors",
    //   'cohort': 2019,
    //   'student_type': "freshmen",
    //   'gap_type': "firstgen",
    // };

    const url = "https://studentresearch.dashboards.calstate.edu/api/faculty-dashboard/what-paths-do-they-follow/chart-data?campus=Bakersfield&college=School%20of%20Arts%20%26%20Humanities&major=Art&flowOption=1";

     // Construct the query string from the parameters
    //  const queryString = new URLSearchParams(params).toString();

     // Append the query string to the URL
     const fullUrl = `${url}`
    // queryString;
     console.log(fullUrl);

     const canvasElement = document.createElement("canvas");
        canvasElement.id = "myPieChart";
        canvasElement.width = 400;  // Set width (optional)
        canvasElement.height = 500; // Set height (optional)
        chartPlaceholder.appendChild(canvasElement);

     fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Rucha:', data);

         // Extract the total number of students
         const totalStudents = data.nodes[0].totalStudents;

         // Extract labels and data
         const labels = data.seriesData.map(item => `${item.from} to ${item.to}`);
         const weights = data.seriesData.map(item => (item.weight / totalStudents) * 100); // Calculate percentage

         console.log(weights);
 
         // Create the pie chart
         const ctx = document.getElementById('myPieChart').getContext('2d');
         const myPieChart = new Chart(ctx, {
             type: 'pie',
             data: {
                 labels: labels,
                 datasets: [{
                     data: weights,
                     backgroundColor: [
                         'rgba(255, 99, 132, 0.2)',
                         'rgba(54, 162, 235, 0.2)',
                         'rgba(255, 206, 86, 0.2)',
                         'rgba(75, 192, 192, 0.2)',
                         'rgba(153, 102, 255, 0.2)'
                     ],
                     borderColor: [
                         'rgba(255, 99, 132, 1)',
                         'rgba(54, 162, 235, 1)',
                         'rgba(255, 206, 86, 1)',
                         'rgba(75, 192, 192, 1)',
                         'rgba(153, 102, 255, 1)'
                     ],
                     borderWidth: 1
                 }]
             },
             options: {
                 responsive: true,
                 plugins: {
                     legend: {
                         position: 'top',
                     },
                     tooltip: {
                         callbacks: {
                             label: function(tooltipItem) {
                                 const value = tooltipItem.raw.toFixed(2);
                                 return `${tooltipItem.label}: ${value}%`;
                             }
                         }
                     }
                 }
             }
         });


      }) .catch((error) => {
        console.error('Error:', error);
      });
}

function displayGoalTracjectories()
{
  const url = "https://studentresearch.dashboards.calstate.edu/api/graduation-initiative/goal-trajectories/ftf_6yr_pell/35";
  const fullUrl = `${url}`;
  const canvasElement = document.createElement("canvas");
  canvasElement.id = "myAreaChart";
  canvasElement.width = 400;  // Set width (optional)
  canvasElement.height = 500; // Set height (optional)
  chartPlaceholder.appendChild(canvasElement);

  fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      // console.log('displayGoalTracjectories:', data);

       // Extract the data for the chart
       const labels = data.result.map(item => item.COHORT);
       const nonPellData = data.result.map(item => item.FTF_6YR_GRAD_NONPELL);
       const pellData = data.result.map(item => item.FTF_6YR_GRAD_PELL);

       // Create the area chart
       const ctx = document.getElementById('myAreaChart').getContext('2d');
       const myAreaChart = new Chart(ctx, {
           type: 'line', // Use 'line' type with fill for area chart
           data: {
               labels: labels,
               datasets: [
                   {
                       label: 'Non-Pell Students',
                       data: nonPellData,
                       backgroundColor: 'rgba(75, 192, 192, 0.4)',
                       borderColor: 'rgba(75, 192, 192, 1)',
                       fill: true,
                       tension: 0.3
                   },
                   {
                       label: 'Pell Students',
                       data: pellData,
                       backgroundColor: 'rgba(153, 102, 255, 0.4)',
                       borderColor: 'rgba(153, 102, 255, 1)',
                       fill: true,
                       tension: 0.3
                   }
               ]
           },
           options: {
               responsive: true,
               scales: {
                   x: {
                       title: {
                           display: true,
                           text: 'Cohort Year'
                       }
                   },
                   y: {
                       beginAtZero: true,
                       title: {
                           display: true,
                           text: '6-Year Graduation Rate (%)'
                       }
                   }
               },
               plugins: {
                   tooltip: {
                       callbacks: {
                           label: function(tooltipItem) {
                               return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
                           }
                       }
                   }
               }
           }
       });


    }) .catch((error) => {
      console.error('Error:', error);
    });

}

async function setUserID(id) {
    userId = id;

    showUserID.textContent = "Your user ID is: " + userId;
    recordInteraction(userId, "Claim User ID", false, false, currentQuestionId, currentAnswer);

    prestudyNotif.style.display = "block";
    claimUserIDButton.style.display = "none";
    beginPrestudyButton.style.display = "block";
}

export async function beginMainStudy() {
    const tableData= await getTableData();
    storeQuestionsInArray(tableData);

    homeContent.style.display = "none"; // Hide the welcome message
    studyContent.style.display = "block"; // Show the study content
    beginMainStudyButton.style.display = "none";

    displayQuestions(); //display main study question
}

function displayQuestions() {

    // displayMyEquityGapsComparisonData();
    // displayMyEquityGapsMajorGaps();
    // displayStudentProgressUnits();
    // displayGoalTracjectories();

  if (currentQuestionIndex < data2DArray.length) {
    submitButton.style.display = "block";
    
    const currentRow = data2DArray[currentQuestionIndex];
    // Assign value to the question text
    questionElement.textContent = currentQuestion.value = `${currentQuestionIndex + 1}. ${currentRow[0]}`;
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";

    currentCorrectAnswer = currentRow[4];

    // Create iframe element using graphURL and URLParams
    const graphURL = currentRow[1];
    const iframeElement = document.createElement("iframe");
    iframeElement.src = `${graphURL}`;
    iframeElement.width = "100%";
    iframeElement.height = "600px";
    iframeElement.style.border = "none";
    
    const graphId = currentRow[7]

    if(graphId === 1){
      displayMyEquityGapsMajorGaps();
    } 
    else if(graphId === 2){
      displayStudentProgressUnits();
    }
    else {
      chartPlaceholder.appendChild(iframeElement);
    }
   
    // const options = JSON.parse(currentRow[3]); // Convert the options string into an array
    const options = currentRow[3];  // options is always in array format

    options.forEach((option, index) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      optionsElement.appendChild(label);
    });
    
    currentQuestionIndex++;
  } else {
    currentQuestionIndex = 0;
    postStudyCongrats.style.display = "block";
    questionElement.textContent = "Study complete. Thank you for participating!";
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
    submitButton.style.display = "none";
  }
}

function storeQuestionsInArray(tableData) {
  for (const entry of tableData.data) {
    const questionText = entry.question_text;
    const graphURL = entry.graph_url;
    const options = entry.options;
    const correctAnswer = entry.correct_ans;
    const questionID = entry.question_id;
    const questionType = entry.question_type;
    const URLParams = entry.url_params;
    const graphId = entry.graph_id;

    //temp array with extracted data
    const rowArray = [
      questionText,
      graphURL,
      URLParams,
      options,
      correctAnswer,
      questionID,
      questionType,
      graphId,
    ];

    data2DArray.push(rowArray); //store all fetched data from table_questions into local 2d array data2DArray
  }
}
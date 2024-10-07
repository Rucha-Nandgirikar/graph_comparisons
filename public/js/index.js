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

import {
    displayGoalTrajectories,
    displayMyEquityGapsComparisonData,
    displayMyEquityGapsMajorGaps,
    displayStudentProgressUnits,
} from "./charts.js"

//welcome screen or home screen
const homeContent = document.getElementById("home-content");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");
const postStudyCongrats = document.getElementById("congrats-cat");

//main study elements
const studyContent = document.getElementById("study-content");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-button");
const prestudyNotif = document.getElementById("prestudy-notif");
const beginStudyButton = document.getElementById("begin-study-button");
const beginMainStudyButton = document.getElementById("begin-main-study-button");

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
let userId = null;
let currentQuestionId = null;
let currentQuestionIndex = 0; 
let currentCorrectAnswer = null;
let data2DArray = []; //stores all queries from test_questions in database locally

// initial page setup
init();

// Add event listeners
submitButton.addEventListener("click", () => {
    checkAnswer(userId, currentQuestionId, currentQuestion, currentCorrectAnswer, currentAnswer);
    recordInteraction(userId, "Submit", true, false, currentQuestionId, currentQuestion, currentAnswer);

    if (!document.querySelector('input[name="answer"]:checked')) {
      alert("Please select an answer.");
      currentAnswer.value = null;
      return;
    } else {
      currentAnswer.value = document.querySelector(
        'input[name="answer"]:checked'
      ).value;
    }
    
    displayQuestions()
});
  
beginPrestudyButton.addEventListener("click", () => {
    recordInteraction(userId, "Begin Prestudy", false, false, currentQuestionId, currentQuestion, currentAnswer);
    homeContent.style.display = "none";

    /* Comment prestudy for dev purposes */
    //displayPrestudyQuestions(prestudyQuestions); 
    beginMainStudy(); 
});
  
claimUserIDButton.addEventListener("click", async () => {
    userId = await getUserID();
    setUserID(userId);
});
  
beginStudyButton.addEventListener("click", () => {
    if(userId !== null) {
        recordInteraction(userId, "Begin Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
    }
    homeContent.style.display = "block";
    beginStudyButton.style.display = "none";
});
  
beginMainStudyButton.addEventListener("click", () => {
    recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
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
    recordInteraction(userId, "Submit", false, true, currentQuestionId, currentQuestion, currentAnswer);
});
  
  //records user click, hides prestudy content, displays calibration screen, and hides calibration
  //screen while starting main study (after 5 seconds) when beginButton is clicked
  startCalibrationButton.addEventListener("click", () => {
    recordInteraction(userId, "Start Calibration", false, false, currentQuestionId, currentQuestion, currentAnswer);
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

        currentPrestudyQuestionIndex++;
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

async function setUserID(id) {
    showUserID.textContent = "Your user ID is: " + id;
    recordInteraction(id, "Claim User ID", false, false, currentQuestionId, currentQuestion, currentAnswer);

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
      displayMyEquityGapsMajorGaps(chartPlaceholder);
    } 
    else if(graphId === 2){
      displayStudentProgressUnits(chartPlaceholder);
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
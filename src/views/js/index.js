import { 
  getTableData,
  checkAnswer,
} from "./mainstudy.js"

import { 
  getUserId,
  recordInteraction,
  recordPrestudyResponse,
  prestudyQuestions,
  assignUserId,
} from "./prestudy.js"

import {
  displayGoalTrajectories,
  displayMyEquityGapsComparisonData,
  displayMyEquityGapsMajorGaps,
  displayStudentProgressUnits,
} from "./charts.js" 

document.addEventListener('DOMContentLoaded', () => {
  const beginButton = document.getElementById('begin');
  const beginStudyButton = document.getElementById('begin-study-button');
  const homeContent = document.getElementById('home-content');
  const claimUserIdButton = document.getElementById('claim-user-id');
  const showUserId = document.getElementById('show-user-id');
  const prestudyNotif = document.getElementById('prestudy-notif');

  //prestudy elements
  const beginPrestudyButton = document.getElementById("begin-prestudy-button");
  const prestudyContent = document.getElementById("prestudy");
  const prestudyQuestionElement = document.getElementById("prestudy-question");
  const prestudySubmitButton = document.getElementById("prestudy-submit-button");
  const prestudyMsgElement = document.getElementById("prestudy-msg");
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

  // Mainstudy elements
  const startCalibrationButton = document.getElementById('start-calibration-button');
  const calibrationScreen = document.getElementById('calibration-screen');
  const beginMainStudyElement = document.getElementById('begin-main-study');
  const beginMainStudyButton = document.getElementById('begin-main-study-button');
  const mainStudy = document.getElementById('main-study');
  const reloadButton = document.getElementById('reload-button');
  const chartPlaceholder = document.getElementById("chart");
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const submitButton = document.getElementById('submit-button');

  // Post study elements
  const postStudyCongrats = document.getElementById('congrats-cat')
  
  // Step 1: Show home content on "BEGIN" button click
  beginStudyButton.addEventListener('click', () => {
    // here db interaction is done for persisting the user id
    homeContent.style.display = 'flex'; 
    beginButton.style.display = 'none';
  });

  // Step 2: Show user ID and prestudy info when "CLAIM YOUR USER ID" is clicked
  claimUserIdButton.addEventListener('click', async () => {
    const data = await assignUserId();
    userId = data.userId;

    claimUserIdButton.style.display = "none";
    showUserId.textContent = `User ID: ${data.userId}`; 
    prestudyNotif.style.display = 'block'; 
    beginPrestudyButton.style.display = 'block';

  });

  // Step 3: Switch to prestudy questions when "BEGIN PRESTUDY" is clicked
  beginPrestudyButton.addEventListener('click', () => {
    homeContent.style.display = 'none';  // Hide home content

    // dev reasons
    // displayPrestudyQuestions(prestudyQuestions);

    beginMainStudy();
  });


  // Step 4: Handle prestudy submission and show the next button
  prestudySubmitButton.addEventListener("click", async () => {

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

  // Step 5: Switch to calibration screen when "NEXT" is clicked
  startCalibrationButton.addEventListener('click', () => {
    calibrationScreen.style.display = 'block'; // Show calibration screen
    prestudyContent.style.display = 'none';

    // For example, after calibration ends, you can show the button for the main study
    setTimeout(() => {
      calibrationScreen.style.display = 'none';  // Hide calibration screen
      beginMainStudyElement.style.display = 'flex'; // Show "BEGIN MAIN STUDY" button
    }, 3000); // Simulate a 3-second calibration screen
  });

  // Step 6: Begin Main Study
  beginMainStudyButton.addEventListener("click", () => {
    recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
    beginMainStudy(); 
  });
  
  // Reload Button for chart
  reloadButton.addEventListener('click', () => {
    clearGraphs()

    const currentRow = data2DArray[currentQuestionIndex];
    displayGraph(currentRow[7])
  });

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
    
    displayNextQuestion()
  });


  /* FUNCTIONS */
  
  
  /**
   * Retrieve/store questions and begin Main Study
   */
  async function beginMainStudy() {
    beginMainStudyElement.style.display = 'none';
    const tableData = await getTableData();
    storeQuestionsInArray(tableData);
 
    homeContent.style.display = "none"; // Hide the welcome message
    mainStudy.style.display = "block"; // Show the study content
    beginMainStudyButton.style.display = "none";
 
    displayNextQuestion(); //display next main study question
  }

  /**
   *  Display next prestudy question
   */
  function displayPrestudyQuestions(questions) {
    prestudyContent.style.display = "flex";
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

  /**
   * Display next Question in question array
   */
  function displayNextQuestion() {
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

      displayGraph(graphId)
      
      const options = currentRow[3]; 

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

  /**
   * Displays appropriate graph based on graphId
   */
  function displayGraph(graphId) {
    if(graphId === 1){
      displayMyEquityGapsMajorGaps(chartPlaceholder);
    } 
    else if(graphId === 2){
      displayStudentProgressUnits(chartPlaceholder);
    }
    else {
      chartPlaceholder.appendChild(iframeElement);
    }
  }
    
  /**
   * Erases current graphs
   */
  function clearGraphs() {
    while (chartPlaceholder.firstChild) {
      chartPlaceholder.removeChild(chartPlaceholder.lastChild);
    }
  }

  /**
   * Stores questions in tableData array
   */
  function storeQuestionsInArray(tableData) {    
    for (const entry of tableData) {
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
  

});

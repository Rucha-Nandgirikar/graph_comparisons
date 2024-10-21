import { 
  getTableData,
  checkAnswer,
} from "./mainstudy.js"

import { 
  recordInteraction,
  recordPrestudyResponse,
  assignUserId,
  prestudyQuestions,
} from "./prestudy.js"

import {
  displayGoalTrajectories,
  displayMyEquityGapsComparisonData,
  displayMyEquityGapsMajorGaps,
  displayStudentProgressUnits,
} from "./charts.js" 

document.addEventListener('DOMContentLoaded', () => {
  // on-launch elements
  const beginStudyButtonWrapper = document.getElementById('begin');
  const beginStudyButton = document.getElementById('begin-study-button');
  const homeContent = document.getElementById('home-content');
  const claimUserIdButton = document.getElementById('claim-user-id');
  const showUserId = document.getElementById('show-user-id');
  const prestudyNotif = document.getElementById('prestudy-notif');

  //prestudy elements
  const userQuestions = prestudyQuestions;
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
  

  /** 
   * EVENT HANDLERS
   */  

  // Step 1: Show home content on "BEGIN" button click
  beginStudyButton.addEventListener('click', () => {
    hideBeginStudyScreen();
    showHomeScreen();
  });

  // Step 2: Show user ID and prestudy info when "CLAIM YOUR USER ID" is clicked
  claimUserIdButton.addEventListener('click', async () => {
    const data = await assignUserId();
    userId = data.userId;

    showUserIdElements()
  });

  // Step 3: Switch to prestudy questions when "BEGIN PRESTUDY" is clicked
  beginPrestudyButton.addEventListener('click', async () => {
    hideHomeScreen();
    
    /* showPrestudyScreen();
    displayNextPrestudyQuestion(); */

    // uncomment for main study
    await loadStudyQuestions(); 
    showMainStudyScreen();
    displayNextQuestion();
   
   
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
    recordInteraction(userId, "Submit", false, true, currentQuestionId, currentQuestion, currentAnswer);
    inputElement.value = "";
  
    if (currentPrestudyQuestionIndex < 6) {
      displayNextPrestudyQuestion();
    }
    else {
      hidePrestudyScreen();
      //showCalibrationScreen();
      showBeginMainStudyScreen();
    }

  });

  // Step 4.5 (OPTIONAL): Switch to calibration screen when "NEXT" is clicked
  startCalibrationButton.addEventListener('click', () => {
    hideCalibrationScreen();
    triggerCalibration();

    setTimeout(() => {
      showBeginMainStudyScreen();
    }, 3000); // Simulate a 3-second calibration screen
  });

  // Step 5: Begin Main Study
  beginMainStudyButton.addEventListener("click", async () => {
    recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
    hideBeginMainStudyScreen();
    
    // Start Study
    await loadStudyQuestions(); 
    showMainStudyScreen();
    displayNextQuestion();
  });
  
  // Reload Button for chart
  reloadButton.addEventListener('click', () => {
    reloadGraph();
  });

  // Submit user response and display next question
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
    
    if (currentQuestionIndex < data2DArray.length) {
      displayNextQuestion()
    } else {
      hideMainStudyScreen();
      showPostStudyCongrats();
    }
  });


  /** 
   * HELPER FUNCTIONS
   */  
  
  function hideBeginStudyScreen() {
    beginStudyButtonWrapper.style.display = 'none';
  }

  function showHomeScreen() {
    homeContent.style.display = 'flex'; 
  }

  function showUserIdElements() {
    claimUserIdButton.style.display = "none";
    showUserId.textContent = `User ID: ${userId}`; 
    prestudyNotif.style.display = 'block'; 
    beginPrestudyButton.style.display = 'block';
  }

  function hideHomeScreen() {
    homeContent.style.display = 'none';
  }

  function showCalibrationScreen(){
    startCalibrationButton.style.display = "flex";
  }

  function hideCalibrationScreen(){
    startCalibrationButton.style.display = "none";
  }

  function showPrestudyScreen() {
    prestudyContent.style.display = "flex";
    prestudySubmitButton.style.display = "block";
  }

  function hidePrestudyScreen() {
    prestudyContent.style.display = 'none';
  }

  function showBeginMainStudyScreen() {
    beginMainStudyElement.style.display = 'flex';
  }

  function hideBeginMainStudyScreen() {
    beginMainStudyButton.style.display = "none";
    beginMainStudyElement.style.display = 'none';
  }

  function showMainStudyScreen() {
    mainStudy.style.display = "block";
    submitButton.style.display = "block";
  }

  function hideMainStudyScreen() {
    mainStudy.style.display = "none";
    submitButton.style.display = "none";
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
  }

  function showPostStudyCongrats() {
    postStudyCongrats.style.display = "block";
    questionElement.textContent = "Study complete. Thank you for participating!";
  }

  function triggerCalibration() {
    startCalibrationButton.style.display = "block";
    prestudyMsgElement.textContent =
      "Prestudy completed! When you click NEXT, you will be shown a blank screen with a tiny plus sign at the center, please focus your eyes on it for 5 seconds. ";
    prestudyQuestionElement.innerHTML = "";
    prestudySubmitButton.style.display = "none";
    currentPrestudyQuestionIndex = 0;
    prestudyChart.innerHTML = "";
    inputElement.style.display = "none";
  }

  /**
   * Retrieve/store questions and begin Main Study
   */
  async function loadStudyQuestions() { 
    const tableData = await getTableData();

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

  /**
   *  Display next prestudy question
   */
  function displayNextPrestudyQuestion() {
    prestudyQuestionElement.innerHTML = currentQuestion.value =
    userQuestions[currentPrestudyQuestionIndex][0];
    prestudyChart.innerHTML = "";
  
    var imageElement = document.createElement("img");
    if (userQuestions[currentPrestudyQuestionIndex][1] != null) {
      imageElement.src =
        "img/prestudy-img/" + userQuestions[currentPrestudyQuestionIndex][1];
      imageElement.alt = "prestudy Chart";
      imageElement.style.width = "auto";
      imageElement.style.height = "400px";
      prestudyChart.appendChild(imageElement);
    }

    currentPrestudyQuestionIndex++;
  }

  /**
   * Display next Question in question array
   */
  function displayNextQuestion() {
    const currentRow = data2DArray[currentQuestionIndex];

    // Assign value to the question text
    questionElement.textContent = currentQuestion.value = `${currentQuestionIndex + 1}. ${currentRow[0]}`;
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";

    currentCorrectAnswer = currentRow[4];
    const options = currentRow[3]; 
    const graphURL = currentRow[1];
    const graphId = currentRow[7]

    // Create iframe element using graphURL and URLParams
    const iframeElement = document.createElement("iframe");
    iframeElement.src = `${graphURL}`;
    iframeElement.width = "100%";
    iframeElement.height = "600px";
    iframeElement.style.border = "none";
    
    displayGraph(graphId)
    
    // Initialize Options
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
   * Reloads current graphs
   */
  function reloadGraph() {
    while (chartPlaceholder.firstChild) {
      chartPlaceholder.removeChild(chartPlaceholder.lastChild);
    }

    const currentRow = data2DArray[currentQuestionIndex];
    displayGraph(currentRow[7])
  }

});

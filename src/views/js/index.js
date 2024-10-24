import { 
  getTableData,
  recordMainStudyResponse,
} from "./mainstudy.js"

import { 
  recordInteraction,
  recordPrestudyResponse,
  createNewUser,
  updateUser,
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
  const frqInput = document.getElementById('frq-answer');
  const optionsElement = document.getElementById('options');
  const submitButton = document.getElementById('submit-button');
  let iframeElement;

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
    // Creates new User
    const user = await createNewUser();
    userId = user.userId;

    showUserIdElements()
  });

  // Step 3: Switch to prestudy questions when "BEGIN PRESTUDY" is clicked
  beginPrestudyButton.addEventListener('click', async () => {
    hideHomeScreen();
    
    // showPrestudyScreen();
    // displayNextPrestudyQuestion();  

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

    if (currentPrestudyQuestionIndex == 0) {
      await updateUser(userId, {
        age: parseInt(currentAnswer.value),
      });
    }
    else if (currentPrestudyQuestionIndex == 1) {
      await updateUser(userId, {
        major: currentAnswer.value,
      });
    }

    await recordPrestudyResponse(userId, currentQuestion, currentAnswer);
    await recordInteraction(userId, "Submit", false, true, currentQuestionId, currentQuestion, currentAnswer);
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
    await recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
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
  submitButton.addEventListener("click", async () => {
    if (!document.querySelector('input[name="answer"]:checked')) {
      alert("Please select an answer.");
      currentAnswer.value = null;
      return;
    } 
    
    currentAnswer.value = document.querySelector(
      'input[name="answer"]:checked'
    ).value;
    
    await recordMainStudyResponse(userId, currentQuestionId, currentQuestion, currentCorrectAnswer, currentAnswer);
    await recordInteraction(userId, "Submit", true, false, currentQuestionId, currentQuestion, currentAnswer);

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

  function showFrqInput() {
    frqInput.style.display = "block";
  }

  function hideFrqInput() {
    frqInput.style.display = "none";
  }

  function clearFrqInput() {
    frqInput.value = '';
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
   * -  Store all fetched data from table_questions into local 2d array data2DArray
   */
  async function loadStudyQuestions() { 
    const tableData = await getTableData();

    for (const entry of tableData) {
      const questionObj = {
        "questionText": entry.question_text,
        "graphURL": entry.graph_url,
        "URLParams": entry.url_params,
        "options": entry.options,
        "correctAnswer": entry.correct_ans,
        "questionID": entry.question_id,
        "questionType": entry.question_type,
        "answerType" : entry.answer_type,
        "graphId": entry.graph_id
      };

      data2DArray.push(questionObj); 
    }
  }

  /**
   *  Display next prestudy question
   */
  function displayNextPrestudyQuestion() {
    prestudyQuestionElement.innerHTML = currentQuestion.value = userQuestions[currentPrestudyQuestionIndex][0];
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
    const currentQuestionObj = data2DArray[currentQuestionIndex];

    currentCorrectAnswer = currentQuestionObj["currentQuestion"];
    let options =  currentQuestionObj["options"]; 
    if(typeof options == "string")
    {
      options =  JSON.parse( currentQuestionObj["options"]); 
    }
   
    const graphURL = currentQuestionObj["graphURL"];
    const graphId = currentQuestionObj["graphId"];
    const questionId = currentQuestionObj["questionID"];
    const questionType = currentQuestionObj["questionType"];
    const questionText = currentQuestionObj["questionText"];
    const answerType = currentQuestionObj["answerType"];

    // Assign value to the question text
    questionElement.textContent = currentQuestion.value = `${currentQuestionIndex + 1}. ${questionText}`;
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";

    // Set vars
    currentQuestionId = questionId;

    // Create iframe element using graphURL and URLParams
    iframeElement = document.createElement("iframe");
    iframeElement.src = `${graphURL}`;
    iframeElement.width = "50%";
    iframeElement.height = "600px";
    iframeElement.style.border = "none";
    
    displayGraph(graphId)

    clearFrqInput();

    if(answerType == "free-response") {
      showFrqInput();
    } else {
      hideFrqInput();
    }
    
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

    const currentQuestionObj = data2DArray[currentQuestionIndex];
    const graphId = currentQuestionObj["graphId"];

    displayGraph(graphId)
  }

});

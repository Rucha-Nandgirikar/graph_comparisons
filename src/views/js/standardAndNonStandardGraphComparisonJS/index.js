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
  displayMyEquityGapsMajorGaps,
  displayStudentProgressUnits,
  displayGoalTrajectories,
  displayWhatPathDoTheyFollow,
  displayEnrollingAndGraduating,
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
  let currentGraphId = null;
  let currentQuestionId = null;
  let currentQuestionName = null;
  let currentQuestionIndex = 0;
  let currentCorrectAnswer = null;
  let testOrderId = null;
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
  const postStudyCongrats = document.getElementById('congrats-cat');
  const navigate = document.getElementById('bar_chart_navigation');
  

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
    await setupNewUser()
    showUserIdElements()
  });

  // Step 3: Switch to prestudy questions when "BEGIN PRESTUDY" is clicked
  beginPrestudyButton.addEventListener('click', async () => {
    hideHomeScreen();
    
    // pre-study
    // showPrestudyScreen();
    // displayNextPrestudyQuestion();  

    // uncomment for main study

    await loadStudyQuestions(); 
    showMainStudyScreen();
    displayNextQuestion();   
   
  });

  // Step 4: Handle prestudy submission and show the next button
  prestudySubmitButton.addEventListener("click", async () => {
    handlePrestudyQuestionSubmit()
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
    beginMainStudy();
  });
  
  // Reload Button for chart
  reloadButton.addEventListener('click', () => {
    reloadGraph();
  });

  // Submit user response and display next question
  submitButton.addEventListener("click", async () => {
    handleMainstudyQuestionSubmit();
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
    mainStudy.style.display = "flex";
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
    navigate.style.display = "flex";
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
   *  Setup new user procedure
   *  - Create new User in User database
   *  - Setup mainstudy variables
   */
  async function setupNewUser() {
    const user = await createNewUser();
    
    userId = user.userId;
    testOrderId = user.testOrderId;
  }

  /**
   *  Handles Logic for submitting prestudy questions
   *  - Checks for selected Input
   *  - Updates user data
   *  - Submits user records
   *  - displays next question or displays mainstudy Screen
   */
  async function handlePrestudyQuestionSubmit() {
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
    await recordInteraction(userId, "Submit", false, true, currentGraphId, currentQuestionId, currentQuestion, currentAnswer);
    inputElement.value = "";
  
    if (currentPrestudyQuestionIndex < 6) {
      displayNextPrestudyQuestion();
    }
    else {
      hidePrestudyScreen();
      //showCalibrationScreen();
      showBeginMainStudyScreen();
    }
  }

  async function beginMainStudy() {
    await recordInteraction(userId, "Begin Main Study", false, false, currentGraphId, currentQuestionId, currentQuestion, currentAnswer);
    hideBeginMainStudyScreen();
    
    // Start Study
    await loadStudyQuestions(); 
    showMainStudyScreen();
    displayNextQuestion();
  }

  /**
   *  Handles logic for submitting mainstudy Questions
   */
  // async function handleMainstudyQuestionSubmit() {
  //   if (!document.querySelector('input[name="answer"]:checked')) {
  //     alert("Please select an answer.");
  //     currentAnswer.value = null;
  //     return;
  //   }

  //   currentQuestionIndex += 1;
    
  //   if (currentQuestionIndex < data2DArray.length) {
  //     const currentQuestionObj = data2DArray[currentQuestionIndex];
  //     const answerType = currentQuestionObj["answerType"];
      
  //     if(answerType === "free-response") {
  //       currentAnswer.value = frqInput.value;
  //     } else {
  //       currentAnswer.value = document.querySelector(
  //         'input[name="answer"]:checked'
  //       ).value;
  //     }
  
  //     await recordMainStudyResponse(userId, currentGraphId, currentQuestionIndex, currentQuestionName, currentQuestion, currentCorrectAnswer, currentAnswer);
  //     await recordInteraction(userId, "Submit", true, false, currentGraphId, currentQuestionId, currentQuestion, currentAnswer);

  //     displayNextQuestion()
  //   } else {
  //     hideMainStudyScreen();
  //     showPostStudyCongrats();
  //   }
  // }

  async function handleMainstudyQuestionSubmit() {
    if (!document.querySelector('input[name="answer"]:checked')) {
      alert("Please select an answer.");
      currentAnswer.value = null;
      return;
    }
   
  
    if (currentQuestionIndex < data2DArray.length) {
      const currentQuestionObj = data2DArray[currentQuestionIndex];

      const answerType = currentQuestionObj["answerType"];
  
      if (answerType === "free-response") {
        currentAnswer.value = frqInput.value;
      } else {
        currentAnswer.value = document.querySelector(
          'input[name="answer"]:checked'
        ).value;
      }
      
      await recordMainStudyResponse(
        userId,
        currentGraphId,
        currentQuestionIndex,
        currentQuestionName,
        currentQuestion,
        currentCorrectAnswer,
        currentAnswer
      );
  
      await recordInteraction(
        userId,
        "Submit",
        true,
        false,
        currentGraphId,
        currentQuestionId,
        currentQuestion,
        currentAnswer
      );
      
      if (currentQuestionIndex != data2DArray.length - 1)
      {
        currentQuestionIndex += 1;
        displayNextQuestion();
      }
      else {
        // **Ensure persistence before proceeding**
        console.log("Final response recorded, proceeding to hide the study screen.");
        hideMainStudyScreen();
        showPostStudyCongrats();
      }
    } else {
      // **Ensure persistence before proceeding**
      console.log("Final response recorded, proceeding to hide the study screen.");
      hideMainStudyScreen();
      showPostStudyCongrats();
    }
  }
  

  /**
   * Retrieve/store questions and begin Main Study
   * -  Store all fetched data from table_questions into local 2d array data2DArray
   */
  async function loadStudyQuestions() { 
    const tableData = await getTableData(userId);

    for (const entry of tableData) {
      const questionObj = {
        "questionName": entry.question_name,
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
    // currentQuestionIndex += 1;
    const currentQuestionObj = data2DArray[currentQuestionIndex];

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
    const questionName = currentQuestionObj["questionName"]
    const questionAnswer = currentQuestionObj["correctAnswer"];
      
    // Assign value to the question text
    questionElement.textContent = currentQuestion.value = `${currentQuestionIndex + 1}. ${questionText}`;

    // Set vars
    let prevGraphId = currentGraphId;
    currentGraphId = graphId;
    currentQuestionId = questionId;
    currentQuestionName = questionName;
    currentCorrectAnswer = questionAnswer;

    // Create iframe element using graphURL and URLParams
    iframeElement = document.createElement("iframe");
    iframeElement.src = `${graphURL}`;
    iframeElement.width = "100%";
    iframeElement.height = "150%";
    iframeElement.style.transform = "scale(0.70)";
    iframeElement.style.transformOrigin = "50% top"
    // iframeElement.style.marginBottom = "-400px";
    iframeElement.style.border = "none";
    
    if(prevGraphId !== currentGraphId) {
      displayGraph(graphId)
    }

    clearFrqInput();

    if(answerType == "free-response") {
      showFrqInput();
    } else {
      hideFrqInput();
    }
    
    // Initialize Options
    optionsElement.innerHTML = "";
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
  }

  /**
   * Displays appropriate graph based on graphId
   */
  function displayGraph(graphId) {
    chartPlaceholder.innerHTML = "";
    if(graphId === 1){
      displayMyEquityGapsMajorGaps(chartPlaceholder);
    } 
    else if(graphId === 2){
      displayStudentProgressUnits(chartPlaceholder);
    }
    else if(graphId === 3){
      displayGoalTrajectories(chartPlaceholder);
    }
    else if(graphId === 4){
      displayWhatPathDoTheyFollow(chartPlaceholder);
    }
    else if(graphId === 5){
      displayEnrollingAndGraduating(chartPlaceholder);
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

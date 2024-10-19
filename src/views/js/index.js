import { 
  getTableData,
  checkAnswer,
} from "./mainstudy.js"
import { 
  getUserID,
  recordInteraction,
  recordPrestudyResponse,
  prestudyQuestions,
} from "./prestudy.js"
document.addEventListener('DOMContentLoaded', () => {
  const beginButton = document.getElementById('begin');
  const beginStudyButton = document.getElementById('begin-study-button');
  const homeContent = document.getElementById('home-content');
  const claimUserIdButton = document.getElementById('claim-user-id');
  const showUserId = document.getElementById('show-user-id');
  const prestudyNotif = document.getElementById('prestudy-notif');

  //prestudy elements
  const beginPrestudyButton = document.getElementById("begin-prestudy-button");
  const chartPlaceholder = document.getElementById("chart");
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

  const startCalibrationButton = document.getElementById('start-calibration-button');
  const calibrationScreen = document.getElementById('calibration-screen');
  const beginMainStudy = document.getElementById('begin-main-study');
  const beginMainStudyButton = document.getElementById('begin-main-study-button');

  
  // Step 1: Show home content on "BEGIN" button click
  beginStudyButton.addEventListener('click', () => {
    // here db interaction is done for persisting the user id
    homeContent.style.display = 'flex'; 
    beginButton.style.display = 'none';
  });

  // Step 2: Show user ID and prestudy info when "CLAIM YOUR USER ID" is clicked
  claimUserIdButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/claim-user-id', {
        method: 'GET', // Change method to 'GET'
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
    
      claimUserIdButton.style.display = "none";
      showUserId.textContent = `User ID: ${data.userId}`; 
      prestudyNotif.style.display = 'block'; 
      beginPrestudyButton.style.display = 'block';
    } catch (error) {
      console.error('Error claiming userId:', error);
      showUserId.textContent = 'Error claiming User ID';
    }
  });

  // Step 3: Switch to prestudy questions when "BEGIN PRESTUDY" is clicked
  beginPrestudyButton.addEventListener('click', () => {
    homeContent.style.display = 'none';  // Hide home content
    displayPrestudyQuestions(prestudyQuestions);
    prestudy.style.display = 'flex';    // Show prestudy questions
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
    
    userId = await getUserId();

    recordPrestudyResponse(userId, currentQuestion, currentAnswer);
    inputElement.value = "";
  
    displayPrestudyQuestions(prestudyQuestions);
    recordInteraction(userId, "Submit", false, true, currentQuestionId, currentQuestion, currentAnswer);

  });

   // Step 5: Switch to calibration screen when "NEXT" is clicked
   startCalibrationButton.addEventListener('click', () => {
    prestudy.style.display = 'none';         // Hide prestudy section
    calibrationScreen.style.display = 'block'; // Show calibration screen

    // For example, after calibration ends, you can show the button for the main study
    setTimeout(() => {
      calibrationScreen.style.display = 'none';  // Hide calibration screen
      beginMainStudy.style.display = 'flex'; // Show "BEGIN MAIN STUDY" button
    }, 3000); // Simulate a 3-second calibration screen
  });


  beginMainStudyButton.addEventListener("click", async () => {
    try {
      await recordInteraction(userId, "Begin Main Study", false, false, currentQuestionId, currentQuestion, currentAnswer);
      beginGraphComparisonStudy(); 
    } catch (error) {
      console.error("Error occurred:", error);
    }
  });
  

  async function beginGraphComparisonStudy() {
    const tableData= await getTableData();

    console.log(tableData);

    storeQuestionsInArray(tableData);
  
    homeContent.style.display = "none"; // Hide the welcome message
    studyContent.style.display = "block"; // Show the study content
    beginMainStudyButton.style.display = "none";
  
    displayQuestions(); //display main study question
  }

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

  async function recordInteraction(userId, buttonName, isMainStudy, isPrestudy, currentQuestionId, currentQuestion, currentAnswer) {
    let localQuestionId = null;
    let localQuestion = null;
    let localUserAnswer = null;
  
    if (!isMainStudy && !isPrestudy) {
      localQuestionId = null;
      localQuestion = null;
      localUserAnswer = null;
    } else if (isPrestudy && !isMainStudy) {
      localQuestionId = null;
      localQuestion = currentQuestion.value.substring(0, 80);
      localUserAnswer = currentAnswer.value;
    } else if (isMainStudy && !isPrestudy) {
      localQuestionId = currentQuestionId + 1;
      localQuestion = currentQuestion.value.substring(0, 80);
      localUserAnswer = currentAnswer.value;
    }
    
    try {
      const responseSubmit = await fetch("/api/submit-user-interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          buttonName,
          questionId: localQuestionId,
          question: localQuestion,
          userAnswer: localUserAnswer,
        }),
      });

      const dataSubmit = await responseSubmit.json();

      console.log("Server response:", dataSubmit);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  }

  // Age submission function
  async function ageSubmission(age) {
  if (!age || isNaN(age)) {
      alert("Please enter a valid age");
      return;
  }

  try {
      const userId = await getUserId();
      if (!userId) {
          alert("Could not fetch user ID");
          return;
      }

      const data = await postUserAge(userId, age);

      if (data.success) {
          alert("Age saved successfully!");
      } else {
          alert("Error saving age.");
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving age.');
  }
  }

  async function getUserId() {
  try {
      const userId = await fetch('/api/get-current-user-id')
          .then(res => res.json())
          .then(data => {
              console.log('User ID:', data.userId);
              return data.userId;
          });
      return userId;
  } catch (error) {
      console.error('Error fetching user ID:', error);
      throw new Error('Unable to fetch user ID');
  }
  }

  async function postUserAge(userId, age) {
  try {
      const response = await fetch('/api/insert-user-age', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId, userAge: age }),
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error posting user age:', error);
      throw new Error('Unable to save user age');
  }
  }

});

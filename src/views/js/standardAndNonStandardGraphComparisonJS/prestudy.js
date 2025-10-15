export const prestudyQuestions = [
    ["What is your age?", null, null, "free-response"],
    ["What is your major?", null, null, "free-response"],
    [
      "The graph above shows the percentage of people who die from different types of cancer." +
        "<br><br>About what percentage of people who die from cancer die from cancer B, cancer C, and cancer D combined?",
      "pie-chart.png",
      null,
      "numeric-input"
    ],
    [
      "You see two magazines advertisements on separate pages. Each advertisement is for a different " +
        "drug for treating heart disease. Each advertisement has a graph for showing the effectiveness of the drug " +
        "compared to a placebo (sugar pill).<br><br>Compared to the placebo, which treatment leads to a larger decrease " +
        "in the percentage of patients who die?",
      "bar-graph.png",
      ["Crosicol", "Hertinol", "They are equal", "Can not say"],
      "multiple-choice"
    ],
  
    [
      "The graph above shows the number of men and women with disease X. The total number of circles is 100.<br><br>" +
        "How many more men than women are there among 100 patients with disease X?",
      "dots.png",
      null,
      "numeric-input"
    ],
  
    [
      "You see two newspaper advertisements on separate pages. Each advertisement is for a different treatment of a skin " +
        "disease. Each advertisement has a graph showing the effectiveness of the treatment over time.<br><br>" +
        "Which of the treatments show a larger decrease in the percentage of sick patients?",
      "line-graph.png",
      ["Apsoriatin", "Nopsorian", "They are equal", "Can not say"],
      "multiple-choice"
    ],
  ];

// Correct answers for scoring
export const prestudyCorrectAnswers = {
    2: ["25", "25%"], // Question 1 (index 2): accepts both "25%" and "25"
    3: ["They are equal"], // Question 2 (index 3): multiple-choice
    4: ["20"], // Question 3 (index 4): numeric input
    5: ["Can not say"] // Question 4 (index 5): multiple-choice
};

export async function recordPrestudyResponse(userId, currentQuestion, currentAnswer, questionIndex) {
    try {
      // Calculate if the answer is correct
      const isCorrect = calculateCorrectness(questionIndex, currentAnswer.value);
      
      const response = await fetch("/api/submit-prestudy-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          userAnswer: currentAnswer.value,
          question: currentQuestion.value.substring(0, 80),
          isCorrect: isCorrect,
        }),
      });
  
      const dataSubmit = await response.json();
      // console.log("Server response:", dataSubmit);
  
    } catch (error) {
      console.error("Error submitting response:", error);
    }

  }

// Helper function to calculate if an answer is correct
function calculateCorrectness(questionIndex, userAnswer) {
  // Questions 0 and 1 (age and major) don't have correct answers
  if (questionIndex < 2) {
    return null;
  }
  
  // Questions 2-5 (indices 2-5) have correct answers
  const correctAnswers = prestudyCorrectAnswers[questionIndex];
  if (correctAnswers) {
    const trimmedAnswer = userAnswer.trim();
    // Check for exact match or numeric match
    return correctAnswers.some(correctAns => {
      // Exact string match
      if (correctAns === trimmedAnswer) return true;
      
      // Numeric comparison (parse both as numbers)
      const userNum = parseFloat(trimmedAnswer.replace('%', ''));
      const correctNum = parseFloat(correctAns.replace('%', ''));
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        return Math.abs(userNum - correctNum) < 0.01; // Allow small floating-point differences
      }
      
      return false;
    });
  }
  
  return null;
}
  
export async function recordInteraction(userId, buttonName, isMainStudy, isPrestudy, currentGraphId, currentQuestionId, currentQuestion, currentAnswer) {
  let localGraphId = null;
  let localQuestionId = null;
  let localQuestion = null;
  let localUserAnswer = null;

  if (!isMainStudy && !isPrestudy) {
    localGraphId = null;
    localQuestionId = null;
    localQuestion = null;
    localUserAnswer = null;
  } else if (isPrestudy && !isMainStudy) {
    localGraphId = null;
    localQuestionId = null;
    localQuestion = currentQuestion.value.substring(0, 80);
    localUserAnswer = currentAnswer.value;
  } else if (isMainStudy && !isPrestudy) {
    localGraphId = currentGraphId;
    localQuestionId = currentQuestionId;
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
        userId: userId,
        buttonName: buttonName,
        graphId: localGraphId,
        questionId: localQuestionId,
        question: localQuestion,
        userAnswer: localUserAnswer,
      }),
    });

    const dataSubmit = await responseSubmit.json();

    // console.log("Server response:", dataSubmit);
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

export async function createNewUser() {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) 
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}


export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData) 
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

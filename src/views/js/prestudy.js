export const prestudyQuestions = [
    ["What is your age?", null],
    ["What is your major?", null],
    [
      "The graph above shows the percentage of people who die from different types of cancer." +
        "<br><br>About what percentage of people who die from cancer die from cancer B, cancer C, and cancer D combined?",
      "pie-chart.png",
    ],
    [
      "You see two magazines advertisements on separate pages. Each advertisement is for a different " +
        "drug for treating heart disease. Each advertisement has a graph for showing the effectiveness of the drug " +
        "compared to a placebo (sugar pill).<br><br>Compared to the placebo, which treatment leads to a larger decrease " +
        "in the percentage of patients who die? <br><br> Please enter an answer from the following: Crosicol, Hertinol, They are equal, Can not say",
      "bar-graph.png",
    ],
  
    [
      "The graph above shows the number of men and women with disease X. The total number of circles is 100.<br><br>" +
        "How many more men than women are there among 100 patients with disease X?",
      "dots.png",
    ],
  
    [
      "You see two newspaper advertisements on separate pages. Each advertisement is for a different treatment of a skin " +
        "disease. Each advertisement has a graph showing the effectiveness of the treatment over time.<br><br>" +
        "Which of the treatments show a larger decrease in the percentage of sick patients?" +
        "<br><br>Please enter an answer from the following: Apsoriatin, Nopsorian, They are equal, Can not say",
      "line-graph.png",
    ],
  ];

export async function recordPrestudyResponse(userId, currentQuestion, currentAnswer) {
    console.log(userId, currentQuestion, currentAnswer);
    try {
      const responseSubmit = await fetch("/api/submit-prestudy-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userAnswer: currentAnswer.value,
          question: currentQuestion.value.substring(0, 80),
        }),
      });
  
      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
  
    } catch (error) {
      console.error("Error submitting response:", error);
    }

  }
  
export async function recordInteraction(userId, buttonName, isMainStudy, isPrestudy, currentQuestionId, currentQuestion, currentAnswer) {
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
export async function ageSubmission(age) {
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

export async function assignUserId() {
  try {
    const response = await fetch('/api/claim-user-id', {
      method: 'GET', // Change method to 'GET'
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
  
    return data;
  } catch (error) {
    console.error('Error claiming userId:', error);
    showUserId.textContent = 'Error claiming User ID';
  }
}

export async function getUserId() {
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

export async function postUserAge(userId, age) {
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

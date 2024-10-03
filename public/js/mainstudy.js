//Start the main study
export async function getTableData() {
    try {
      const response = await fetch("/fetch-entire-table", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const tableData = await response.json();
      
      return tableData;
      
    } catch (error) {
      console.error("Error starting the study:", error);
    }
}
  
export async function checkAnswer(currentQuestionId, currentCorrectAnswer) {
    if (!document.querySelector('input[name="answer"]:checked')) {
      alert("Please select an answer.");
      currentAnswer.value = null;
      return;
    } else {
      currentAnswer.value = document.querySelector(
        'input[name="answer"]:checked'
      ).value;
    }
  
    console.log(currentAnswer.value);
  
    try {
      const responseSubmit = await fetch("/submit-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userAnswer: currentAnswer.value,
          questionNumber: currentQuestionId + 1,
          question: currentQuestion.value.substring(0, 100),
          isCorrect: currentAnswer.value === currentCorrectAnswer,
        }),
      });
  
      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
  
      displayQuestion();
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  }
  

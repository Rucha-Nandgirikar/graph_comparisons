//Start the main study
export async function getTableData() {
    try {
      const response = await fetch("/api/test-questions", {
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
  
export async function checkAnswer(userId, currentQuestionId, currentQuestion, currentCorrectAnswer, currentAnswer) {
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
  
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  }
  

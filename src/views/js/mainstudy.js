//Start the main study
export async function getTableData(userId) {
    try {
      const response = await fetch(`/api/test-questions/${userId}`, {
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
  
// TODO: Incorporate frq questions to answer for isCorrect
export async function recordMainStudyResponse(userId, currentQuestionId, currentQuestion, currentCorrectAnswer, currentAnswer) {
    try {
      console.log(userId, currentQuestionId, currentQuestion, currentCorrectAnswer, currentAnswer)

      const responseSubmit = await fetch("/api/submit-mainstudy-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          userAnswer: currentAnswer.value,
          questionNumber: currentQuestionId,
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
  

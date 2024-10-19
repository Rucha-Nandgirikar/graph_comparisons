class Question {
    constructor(data) {
      this.question_id = data.question_id;
      this.question_text = data.question_text;
      this.options = data.options; 
      this.correct_ans = data.correct_ans;
      this.question_type = data.question_type;
      this.graph_type = data.graph_type;
      this.url_params = data.url_params; 
      this.graph_id = data.graph_id;
      this.graph_name = data.graph_name;
      this.graph_url = data.graph_url;
    }
  
    // Method to safely parse JSON fields
    parseJson(jsonString) {
      try {
        return JSON.parse(jsonString); // Parse JSON string to array/object
      } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return null; // Return null or an empty array/object in case of parsing error
      }
    }
}
  
module.exports = Question;
  
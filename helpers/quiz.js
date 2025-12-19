module.exports = {
  create(exercises) {
    return exercises.map(e => ({
      id: e.id,
      question: e.question,
      answer: e.answerKey ? e.answerKey.toString().trim() : ""  
    }));
  },

  evaluate(quiz, userAnswers) {
    let score = 0;
    let details = [];

    quiz.forEach(q => {
      const userAns = (userAnswers[`answer_${q.id}`] || "").toString().trim();
      const correct = q.answer;

      const isCorrect = userAns.toLowerCase() === correct.toLowerCase(); 
      if (isCorrect) score++;

      details.push({
        question: q.question,
        studentAnswer: userAns,
        correctAnswer: correct,
        isCorrect
      });
    });

    return { score, details };
  }
};

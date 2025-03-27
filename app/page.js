"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Java",
      topic: "Programming",
      difficulty: "Intermediate",
      category: "java",
      questions: [],
    },
    {
      id: 2,
      title: "React",
      topic: "Web Development",
      difficulty: "Beginner",
      category: "react",
      questions: [],
    },
    {
      id: 3,
      title: "MongoDB",
      topic: "Database",
      difficulty: "Advanced",
      category: "mongodb",
      questions: [],
    },
    {
      id: 5,
      title: "HTML",
      topic: "Web Development",
      difficulty: "Advanced",
      category: "html",
      questions: [],
    },
    {
      id: 6,
      title: "C++",
      topic: "Programming",
      difficulty: "Advanced",
      category: "c",
      questions: [],
    },
    {
      id: 7,
      title: "My SQL",
      topic: "Database",
      difficulty: "Advanced",
      category: "sql",
      questions: [],
    },
  ]);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (activeQuiz) {
      setLoading(true);
      axios
        .get(
          `http://localhost:8080/api/questions/byCategory?category=${activeQuiz.category}`
        )
        .then((res) => {
          console.log("API Response:", res.data); // Log the response
          setQuestions(res?.data);
          setTimeLeft(600);
          setUserAnswers({});
          setCurrentQuestionIndex(0);
          setQuizCompleted(false);
          setScore(null);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
        });
    }
  }, [activeQuiz]);

  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted && activeQuiz) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizCompleted, activeQuiz]);

  const handleSelect = (questionId, selectedIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;

    Object.keys(userAnswers).forEach((qId) => {
      const question = questions.find((q) => q.id === qId);
      if (question && userAnswers[qId] === question.correctIndex) {
        correctAnswers += 1;
      }
    });

    const totalQuestions = 20; // Each quiz has 20 questions
    const finalScore = `${correctAnswers}/${totalQuestions}`;
    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);

    setScore(finalScore);
    setQuizCompleted(true);
    setScoreHistory((prev) => [
      ...prev,
      {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score: finalScore,
        percentage: percentageScore,
        date: new Date().toLocaleDateString(),
      },
    ]);
  };

  const startNewQuiz = () => {
    setActiveQuiz(null);
    setQuizCompleted(false);
    setShowReview(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const renderReviewAnswers = () => {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Review Answers
        </h2>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Question {index + 1}: {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-2 ${
                    userAnswers[question.id] === i &&
                    question.correctIndex !== i
                      ? "border-red-500 bg-red-50"
                      : userAnswers[question.id] === i
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  } ${
                    question.correctIndex === i
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border-2 mr-3 ${
                        userAnswers[question.id] === i &&
                        question.correctIndex !== i
                          ? "border-red-500 bg-red-500 text-white"
                          : userAnswers[question.id] === i
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : question.correctIndex === i
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {userAnswers[question.id] === i &&
                      question.correctIndex !== i ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : question.correctIndex === i ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : userAnswers[question.id] === i ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : null}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  if (!activeQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
            Online Examination System
          </h1>

          {scoreHistory.length > 0 && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Your Previous Scores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scoreHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 p-4 rounded-md border-l-4 border-indigo-500"
                  >
                    <h3 className="font-medium text-indigo-800">
                      {item.quizTitle}
                    </h3>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">{item.date}</span>
                      <span className="font-bold text-indigo-700">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Available Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
                onClick={() => setActiveQuiz(quiz)}
              >
                <div className="p-1 bg-indigo-600"></div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{quiz.topic}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {quiz.difficulty}
                    </span>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded-md transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQuiz(quiz);
                      }}
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Exam questions...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = parseInt(score.split("/")[0], 10);
    let performanceMessage = "";

    if (correctAnswers >= 16) {
      performanceMessage = "Excellent work! You've mastered this topic.";
    } else if (correctAnswers >= 11) {
      performanceMessage = "Good job! You're on the right track.";
    } else {
      performanceMessage = "Keep practicing! You'll improve next time.";
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-1 bg-indigo-600"></div>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Exam Completed!
            </h2>

            <div className="mb-8">
              <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4">
                <div className="text-4xl font-bold text-indigo-700">
                  {score}
                </div>
              </div>
              <p className="text-gray-600">{performanceMessage}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg mb-8">
              <h3 className="font-semibold text-indigo-800 mb-2">
                Exam Summary
              </h3>
              <p className="text-gray-700">Exam: {activeQuiz.title}</p>
              <p className="text-gray-700">
                Questions Answered: {Object.keys(userAnswers).length} of{" "}
                {questions.length}
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition"
                onClick={() => {
                  setActiveQuiz({ ...activeQuiz });
                }}
              >
                Retry Exam
              </button>
              <button
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-6 rounded-lg transition"
                onClick={startNewQuiz}
              >
                Return to All Questions
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition"
                onClick={() => setShowReview(true)}
              >
                Review Answers
              </button>
            </div>

            {showReview && renderReviewAnswers()}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            {activeQuiz.title}
          </h1>
          <div className="flex items-center">
            <div
              className={`font-medium ${
                timeLeft < 60 ? "text-red-600" : "text-gray-700"
              }`}
            >
              Time Left: {formatTime(timeLeft)}
            </div>
            <button
              onClick={startNewQuiz}
              className="ml-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Exit Exam
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-5">
          <div className="p-1 bg-indigo-600"></div>
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {Object.keys(userAnswers).length} of {questions.length} answered
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion && currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion &&
                  currentQuestion.options.map((option, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelect(currentQuestion.id, i)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                        userAnswers[currentQuestion.id] === i
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 mr-3 ${
                            userAnswers[currentQuestion.id] === i
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {userAnswers[currentQuestion.id] === i && (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-800">{option}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`py-2 px-4 rounded-md ${
                  currentQuestionIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                >
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg  w-full shadow-sm p-4 ">
        <div className="flex justify-center  items-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  userAnswers[questions[index].id] !== undefined
                    ? "bg-indigo-600 text-white"
                    : index === currentQuestionIndex
                    ? "bg-indigo-100 text-indigo-800 border border-indigo-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
          >
            Finish Early
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react'
import '../styles/Quiz.css'

function Quiz({ question, currentQuestion, totalQuestions, handleAnswerClick, score }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerLocked, setAnswerLocked] = useState(false)
  
  const handleAnswer = (answer, index) => {
    if (answerLocked) return
    
    setSelectedAnswer(index)
    setAnswerLocked(true)
    
    // Add a small delay before moving to next question
    setTimeout(() => {
      handleAnswerClick(answer.correct)
      setSelectedAnswer(null)
      setAnswerLocked(false)
    }, 750)
  }
  
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-stats">
          <span className="question-count">Question {currentQuestion + 1}/{totalQuestions}</span>
          <span className="score">Score: {score}</span>
        </div>
        <h2 className="category">{question.category}</h2>
      </div>
      
      <div className="question-container">
        <h3 dangerouslySetInnerHTML={{ __html: question.question }}></h3>
        
        <div className="answer-container">
          {question.answers.map((answer, index) => (
            <button 
              key={index}
              onClick={() => handleAnswer(answer, index)}
              className={`answer-button ${selectedAnswer === index ? (answer.correct ? 'correct' : 'incorrect') : ''}`}
              disabled={answerLocked}
              dangerouslySetInnerHTML={{ __html: answer.text }}
            >
            </button>
          ))}
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Quiz 
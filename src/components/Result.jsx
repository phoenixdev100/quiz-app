import React, { useEffect } from 'react'
import '../styles/Result.css'

function Result({ score, totalQuestions, resetQuiz, startNewQuiz }) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  let message = ''
  let emoji = ''
  
  if (percentage >= 80) {
    message = 'Excellent! You\'re a quiz master!'
    emoji = '🏆'
  } else if (percentage >= 60) {
    message = 'Good job! You know your stuff!'
    emoji = '🎉'
  } else if (percentage >= 40) {
    message = 'Not bad! Keep learning!'
    emoji = '👍'
  } else {
    message = 'Keep practicing! You\'ll get better!'
    emoji = '📚'
  }
  
  // Create confetti effect for high scores
  useEffect(() => {
    if (percentage >= 70) {
      createConfetti()
    }
  }, [percentage])
  
  const createConfetti = () => {
    const confettiCount = 150
    const container = document.querySelector('.result-container')
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      
      // Random position, color, and animation delay
      const size = Math.random() * 10 + 5
      const color = getRandomColor()
      const left = Math.random() * 100
      const animationDelay = Math.random() * 3
      
      confetti.style.width = `${size}px`
      confetti.style.height = `${size}px`
      confetti.style.backgroundColor = color
      confetti.style.left = `${left}%`
      confetti.style.animationDelay = `${animationDelay}s`
      
      container.appendChild(confetti)
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove()
      }, 6000)
    }
  }
  
  const getRandomColor = () => {
    const colors = [
      '#6366f1', // primary
      '#4f46e5', // primary-hover
      '#10b981', // secondary
      '#059669', // secondary-hover
      '#f59e0b', // yellow
      '#ec4899'  // pink
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="result-container">
      <h1>Quiz Results</h1>
      <div className="score-container">
        <div className="score-circle">
          <span className="score-text">{score}/{totalQuestions}</span>
          <span className="percentage">{percentage}%</span>
        </div>
      </div>
      <p className="result-message">
        <span className="emoji">{emoji}</span> {message}
      </p>
      <div className="button-container">
        <button onClick={startNewQuiz} className="new-quiz-button">
          New Quiz
        </button>
        <button onClick={resetQuiz} className="reset-button">
          Back to Home
        </button>
      </div>
      
      {percentage >= 80 && (
        <div className="achievement">
          <div className="achievement-icon">🌟</div>
          <div className="achievement-text">Achievement Unlocked: Quiz Master!</div>
        </div>
      )}
    </div>
  )
}

export default Result 
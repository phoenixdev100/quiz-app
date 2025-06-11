import { useState, useEffect } from 'react'
import axios from 'axios'
import Quiz from './components/Quiz'
import Result from './components/Result'
import LandingPage from './components/LandingPage'
import './styles/App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [quizStarted, setQuizStarted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [category, setCategory] = useState('') // '' means any category
  const [stats, setStats] = useState({
    questionsAnswered: parseInt(localStorage.getItem('questionsAnswered') || '0'),
    quizzesTaken: parseInt(localStorage.getItem('quizzesTaken') || '0'),
    bestScore: parseInt(localStorage.getItem('bestScore') || '0')
  })

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('quizProgress'))
    if (savedProgress) {
      // Only restore the quiz if it was in progress
      if (savedProgress.quizStarted && !savedProgress.showResult && savedProgress.questions.length > 0) {
        setQuestions(savedProgress.questions)
        setCurrentQuestion(savedProgress.currentQuestion)
        setScore(savedProgress.score)
        setShowResult(savedProgress.showResult)
        setQuizStarted(savedProgress.quizStarted)
        setDifficulty(savedProgress.difficulty)
        setCategory(savedProgress.category || '')
      } else {
        // If the quiz was completed or not started, just restore preferences
        setDifficulty(savedProgress.difficulty || 'medium')
        setCategory(savedProgress.category || '')
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    if (questions.length > 0 || quizStarted) {
      localStorage.setItem('quizProgress', JSON.stringify({
        questions,
        currentQuestion,
        score,
        showResult,
        quizStarted,
        difficulty,
        category
      }))
    }
  }, [questions, currentQuestion, score, showResult, quizStarted, difficulty, category])

  // Update stats when quiz is completed
  useEffect(() => {
    if (showResult && quizStarted) {
      // Calculate percentage score
      const percentage = Math.round((score / questions.length) * 100)
      
      // Update stats
      const newStats = {
        questionsAnswered: stats.questionsAnswered + questions.length,
        quizzesTaken: stats.quizzesTaken + 1,
        bestScore: Math.max(stats.bestScore, percentage)
      }
      
      // Save to localStorage
      localStorage.setItem('questionsAnswered', newStats.questionsAnswered.toString())
      localStorage.setItem('quizzesTaken', newStats.quizzesTaken.toString())
      localStorage.setItem('bestScore', newStats.bestScore.toString())
      
      // Update state
      setStats(newStats)
    }
  }, [showResult, quizStarted])

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    
    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(loadingInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)
    
    try {
      let url = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
      
      if (category) {
        url += `&category=${category}`
      }
      
      const response = await axios.get(url)
      
      if (response.data.response_code === 0) {
        // Format the questions for our app
        const formattedQuestions = response.data.results.map(question => {
          const answers = [
            ...question.incorrect_answers.map(answer => ({ text: answer, correct: false })),
            { text: question.correct_answer, correct: true }
          ]
          
          // Shuffle answers
          const shuffledAnswers = answers.sort(() => Math.random() - 0.5)
          
          return {
            question: question.question,
            answers: shuffledAnswers,
            category: question.category
          }
        })
        
        setQuestions(formattedQuestions)
        setCurrentQuestion(0)
        setScore(0)
        setShowResult(false)
        setQuizStarted(true)
        setLoadingProgress(100)
        
        // Small delay to show 100% before hiding loader
        setTimeout(() => {
          setLoading(false)
          clearInterval(loadingInterval)
        }, 300)
      } else {
        setError('Failed to fetch questions. Please try again.')
        clearInterval(loadingInterval)
        setLoading(false)
      }
    } catch (err) {
      setError('Error connecting to the quiz API. Please check your connection and try again.')
      clearInterval(loadingInterval)
      setLoading(false)
    }
  }

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1
    
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    localStorage.removeItem('quizProgress')
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setQuizStarted(false)
  }

  const startNewQuiz = () => {
    fetchQuestions()
  }

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }
  
  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId)
  }

  if (loading && quizStarted) {
    return (
      <div className="app">
        <h1>Loading questions...</h1>
        <div className="loading-container">
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="loading-text">{loadingProgress}%</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <h1>Error</h1>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
        </div>
        <button onClick={fetchQuestions} className="start-button">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      {!quizStarted ? (
        <LandingPage 
          startQuiz={startNewQuiz} 
          difficulty={difficulty} 
          onDifficultyChange={handleDifficultyChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          stats={stats}
        />
      ) : showResult ? (
        <Result 
          score={score} 
          totalQuestions={questions.length} 
          resetQuiz={resetQuiz} 
          startNewQuiz={startNewQuiz}
        />
      ) : (
        <Quiz 
          question={questions[currentQuestion]} 
          currentQuestion={currentQuestion} 
          totalQuestions={questions.length}
          handleAnswerClick={handleAnswerClick}
          score={score}
        />
      )}
      
      <div className="copyright">
        © {new Date().getFullYear()} Quiz Master. Made by Deepak
      </div>
    </div>
  )
}

export default App 
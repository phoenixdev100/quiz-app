import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LandingPage.css';

function LandingPage({ startQuiz, difficulty, onDifficultyChange, category, onCategoryChange, stats }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [activeTab, setActiveTab] = useState('play');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        setCategories(response.data.trivia_categories);
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleStartQuiz = () => {
    startQuiz();
  };
  
  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    setShowCategoryDropdown(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>
          <span className="quiz-title-main">Quiz</span>
          <span className="quiz-title-accent">Master</span>
        </h1>
        <p className="landing-subtitle">Test your knowledge with our interactive quizzes!</p>
      </div>
      
      <div className="landing-tabs">
        <button 
          className={`tab-button ${activeTab === 'play' ? 'active' : ''}`} 
          onClick={() => setActiveTab('play')}
        >
          Play Quiz
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`} 
          onClick={() => setActiveTab('stats')}
        >
          Your Stats
        </button>
      </div>
      
      <div className="landing-content">
        {activeTab === 'play' && (
          <div className="play-tab">
            <div className="quiz-options">
              <div className="option-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select 
                  id="difficulty" 
                  value={difficulty} 
                  onChange={onDifficultyChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="option-group">
                <label>Category:</label>
                <div className="category-dropdown">
                  <button 
                    className="category-button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    {category ? categories.find(c => c.id === parseInt(category))?.name : 'Any Category'} 
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="category-dropdown-menu">
                      <div 
                        className="category-item" 
                        onClick={() => handleCategorySelect('')}
                      >
                        Any Category
                      </div>
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className="category-item"
                          onClick={() => handleCategorySelect(cat.id)}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={handleStartQuiz} className="start-quiz-button">
              Start Quiz
            </button>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="stats-tab">
            <div className="stats-cards">
              <div className="stats-card">
                <div className="stats-icon">🎯</div>
                <div className="stats-info">
                  <div className="stats-value">{stats.questionsAnswered}</div>
                  <div className="stats-label">Questions Answered</div>
                </div>
              </div>
              
              <div className="stats-card">
                <div className="stats-icon">🏆</div>
                <div className="stats-info">
                  <div className="stats-value">{stats.quizzesTaken}</div>
                  <div className="stats-label">Quizzes Completed</div>
                </div>
              </div>
              
              <div className="stats-card">
                <div className="stats-icon">⭐</div>
                <div className="stats-info">
                  <div className="stats-value">{stats.bestScore}%</div>
                  <div className="stats-label">Best Score</div>
                </div>
              </div>
            </div>
            
            <div className="stats-message">
              {stats.quizzesTaken > 0 
                ? "Keep challenging yourself to improve your knowledge!" 
                : "Complete your first quiz to start tracking your stats!"}
            </div>
            
            {stats.quizzesTaken > 0 && (
              <button onClick={handleStartQuiz} className="start-quiz-button">
                Take Another Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage; 
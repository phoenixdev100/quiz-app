# Quiz App

A React-based quiz application that fetches random questions from the Open Trivia Database API.

## Features

- 🔄 Random questions for each quiz session from Open Trivia Database API
- 🎚️ Three difficulty levels: Easy, Medium, Hard
- 💾 Progress saved in localStorage
- 📊 Score tracking and results summary

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Running the App

To start the development server:

```
npm run dev
```
or
```
yarn dev
```

Then open your browser and navigate to `http://localhost:5173`

## How It Works

1. Select a difficulty level (Easy, Medium, Hard)
2. Start the quiz
3. Answer 10 multiple-choice questions
4. View your results
5. Start a new quiz or reset

## API Integration

This app uses the [Open Trivia Database API](https://opentdb.com/api.php) to fetch random quiz questions. 
// Quiz Application
class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.answered = false;
        
        // DOM elements
        this.questionProgress = document.getElementById('question-progress');
        this.questionCategory = document.getElementById('question-category');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.nextButton = document.getElementById('next-button');
        this.feedback = document.getElementById('feedback');
        this.quizArea = document.getElementById('quiz-area');
        this.resultsArea = document.getElementById('results-area');
        this.scoreElement = document.getElementById('score');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.restartButton = document.getElementById('restart-button');
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.loadProgress();
        this.displayQuestion();
        this.addProgressIndicator();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('quiz_questions.json');
            const data = await response.json();
            
            // Flatten questions from all categories
            this.questions = [];
            data.forEach(category => {
                category.questions.forEach(question => {
                    this.questions.push({
                        ...question,
                        category: category.category
                    });
                });
            });
            
            // Shuffle questions for variety
            this.shuffleArray(this.questions);
            
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questionText.textContent = 'Error loading quiz questions. Please refresh the page.';
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setupEventListeners() {
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
    }
    
    addProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div class="progress-bar"></div>';
        
        const questionCounter = document.createElement('div');
        questionCounter.className = 'question-counter';
        questionCounter.id = 'question-counter';
        
        this.quizArea.insertBefore(progressContainer, this.questionCategory);
        this.quizArea.insertBefore(questionCounter, this.questionCategory);
    }
    
    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const questionCounter = document.getElementById('question-counter');
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    }
    
    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Add fade-in animation
        this.quizArea.classList.add('fade-in');
        setTimeout(() => this.quizArea.classList.remove('fade-in'), 500);
        
        // PROGRESS
        this.questionProgress.textContent = "" + this.currentQuestionIndex + "/" + this.questions.length;

        // ACTUAL CONTENT
        this.questionCategory.textContent = "CATEGORY " + question.category;
        this.questionText.textContent = question.question;
        
        this.optionsContainer.innerHTML = '';
        this.feedback.style.display = 'none';
        this.nextButton.disabled = true;
        this.answered = false;
        this.selectedAnswer = null;
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            this.optionsContainer.appendChild(optionElement);
        });
        
        this.updateProgress();
    }
    
    selectAnswer(selectedIndex) {
        if (this.answered) return;
        
        this.selectedAnswer = selectedIndex;
        this.answered = true;
        
        const question = this.questions[this.currentQuestionIndex];
        const options = this.optionsContainer.querySelectorAll('.option');
        
        // Disable all options
        options.forEach(option => option.classList.add('disabled'));
        
        // Show correct and incorrect answers
        question.options.forEach((option, index) => {
            if (option.is_correct) {
                options[index].classList.add('correct');
            } else if (index === selectedIndex) {
                options[index].classList.add('incorrect');
            }
        });
        
        // Show feedback
        const selectedOption = question.options[selectedIndex];
        this.feedback.textContent = selectedOption.explanation;
        this.feedback.className = selectedOption.is_correct ? 'correct' : 'incorrect';
        this.feedback.style.display = 'block';
        
        // Update score
        if (selectedOption.is_correct) {
            this.score++;
        }
        
        // Enable next button
        this.nextButton.disabled = false;
        
        // Save progress
        this.saveProgress();
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }
    
    showResults() {
        this.quizArea.style.display = 'none';
        this.resultsArea.style.display = 'block';
        
        this.scoreElement.textContent = this.score;
        this.totalQuestionsElement.textContent = this.questions.length;
        
        // Clear saved progress
        localStorage.removeItem('quizProgress');
        
        // Add celebration effect for good scores
        const percentage = (this.score / this.questions.length) * 100;

        if (percentage >= 80) {
            this.resultsArea.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            this.resultsArea.style.color = 'white';
            this.resultsArea.style.borderRadius = '15px';
            this.resultsArea.style.padding = '30px';
        }
    }
    
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.answered = false;
        
        this.quizArea.style.display = 'block';
        this.resultsArea.style.display = 'none';
        this.resultsArea.style.background = '';
        this.resultsArea.style.color = '';
        this.resultsArea.style.borderRadius = '';
        this.resultsArea.style.padding = '';
        
        // Shuffle questions again for variety
        this.shuffleArray(this.questions);
        
        this.displayQuestion();
        localStorage.removeItem('quizProgress');
    }
    
    saveProgress() {
        const progress = {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
            timestamp: Date.now()
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            
            // Only load if saved within last 24 hours
            const hoursSinceLastSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
            if (hoursSinceLastSave < 24) {
                this.currentQuestionIndex = progress.currentQuestionIndex;
                this.score = progress.score;
            }
        }
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4') {
        const optionIndex = parseInt(e.key) - 1;
        const options = document.querySelectorAll('.option');
        if (options[optionIndex] && !options[optionIndex].classList.contains('disabled')) {
            options[optionIndex].click();
        }
    } else if (e.key === 'Enter' || e.key === ' ') {
        const nextButton = document.getElementById('next-button');
        const restartButton = document.getElementById('restart-button');
        
        if (nextButton && !nextButton.disabled && nextButton.offsetParent !== null) {
            e.preventDefault();
            nextButton.click();
        } else if (restartButton && restartButton.offsetParent !== null) {
            e.preventDefault();
            restartButton.click();
        }
    }
});


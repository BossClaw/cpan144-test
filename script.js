// Quiz Application
class QuizApp {
	constructor() {
		this.questions = [];
		this.currentQuestionIndex = 0;
		this.score = 0;
		this.firstAttemptCorrect = 0; // New variable to track first attempt correct answers
		this.selectedAnswer = null;
		this.answered = false;
		this.answeredCorrect = false;

		// DOM elements
		this.questionProgress = document.getElementById("question-progress");
		this.questionCategory = document.getElementById("question-category");
		this.questionText = document.getElementById("question-text");
		this.optionsContainer = document.getElementById("options-container");
		this.nextButton = document.getElementById("next-button");
		this.feedback = document.getElementById("feedback");
		this.quizArea = document.getElementById("quiz-area");
		this.resultsArea = document.getElementById("results-area");
		this.scoreElement = document.getElementById("score");
		this.totalQuestionsElement = document.getElementById("total-questions");
		this.restartButton = document.getElementById("restart-button");

		this.init();
	}

	async init() {
		await this.loadQuestions();
		this.setupEventListeners();
		this.loadProgress();
		this.displayQuestion();
	}

	async loadQuestions() {
		try {
			const response = await fetch("quiz_questions.json");
			const data = await response.json();

			// Flatten questions from all categories
			this.questions = [];
			data.forEach((category) => {
				category.questions.forEach((question) => {
					this.questions.push({
						...question,
						category: category.category,
						answeredCorrectlyOnFirstAttempt: false, // New property for each question
					});
				});
			});

			// Shuffle questions for variety
			this.shuffleArray(this.questions);
		} catch (error) {
			console.error("Error loading questions:", error);
			this.questionText.textContent = "Error loading quiz questions. Please refresh the page.";
		}
	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	setupEventListeners() {
		this.nextButton.addEventListener("click", () => this.nextQuestion());
		this.restartButton.addEventListener("click", () => this.restartQuiz());
	}

	updateProgress() {
		const progressBar = document.querySelector("#progress-bar");
		const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
		progressBar.style.width = `${progress}%`;
	}

	displayQuestion() {
		if (this.currentQuestionIndex >= this.questions.length) {
			this.showResults();
			return;
		}

		const question = this.questions[this.currentQuestionIndex];

		// Add fade-in animation
		this.quizArea.classList.add("fade-in");
		setTimeout(() => this.quizArea.classList.remove("fade-in"), 250);

		// PROGRESS
		this.questionProgress.textContent = "" + this.currentQuestionIndex + "/" + this.questions.length;

		// ACTUAL CONTENT
		this.questionCategory.textContent = question.category;
		this.questionText.textContent = question.question;

		this.optionsContainer.innerHTML = "";
		this.feedback.style.display = "none";
		this.nextButton.disabled = true;

		// RESET ANSWERED STATUS FOR NEW QUESTION
		this.answered = false;
		this.answeredCorrect = false;

		this.selectedAnswer = null;

		// Shuffle options for the current question
		const shuffledOptions = [...question.options];
		this.shuffleArray(shuffledOptions);

		shuffledOptions.forEach((option, index) => {
			const optionElement = document.createElement("div");
			optionElement.className = "option";
			optionElement.textContent = option.text;
			optionElement.dataset.originalIndex = question.options.indexOf(option); // Store original index
			optionElement.addEventListener("click", () => this.selectAnswer(optionElement, option.is_correct));
			this.optionsContainer.appendChild(optionElement);
		});

		this.updateProgress();
	}

	selectAnswer(selectedOptionElement, isCorrect) {
		// console.log("SELECT ANSWER[" + selectedOptionElement + "] CORRECT[" + isCorrect + "]");

		// GET TEH CUR QUESTION
		const currentQuestion = this.questions[this.currentQuestionIndex];

		// IF CORRECT DO NOTHING
		// WIP - ALLOW MULTIPLE 'WRONG ANSWERS'
		// if (currentQuestion.answeredCorrect answeredCorrectlyOnFirstAttempt || (this.answered && !isCorrect)) {
		// if (this.answeredCorrect) {
		// 	return;
		// }

		// GET OPTIONS
		const options = this.optionsContainer.querySelectorAll(".option");

		// WIP - Clear previous feedback and selections for re-attempts
		if (!this.answered) {
			// Only clear if it's the very first attempt for this question
			this.feedback.style.display = "none";
			options.forEach((option) => {
				option.classList.remove("selected", "correct", "incorrect", "disabled");
			});
		}

		// UPDATE SELECTED
		selectedOptionElement.classList.add("selected");

		// STUFF
		const originalIndex = parseInt(selectedOptionElement.dataset.originalIndex);
		const selectedOption = currentQuestion.options[originalIndex];

		// FEEDBACK
		this.feedback.textContent = selectedOption.explanation;
		this.feedback.style.display = "block";

		// HANDLE IF IS CORRECT
		if (isCorrect) {
			// UPDATE FEEDBACK & STYLE
			this.feedback.className = "feedback correct";
			selectedOptionElement.classList.add("correct");

			// HANDLE IF CORRECT ON FIRST TRY
			if (!this.answered) {
				this.firstAttemptCorrect++;                
				currentQuestion.answeredCorrectlyOnFirstAttempt = true; // Mark question as answered correctly on first attempt
			}

            // ANY POINT IN ANSWERING
            this.answeredCorrect = true;

			// ALLOW MOVING ONTO NEXT QUESTION
			this.nextButton.disabled = false;

			// LOCK SELECTION AFTER CORRECT ANSWER
			this.answered = true;

			// WIP - DISABLE ALL OPTIONS AFTER CORRECT ANSWER
			options.forEach((option) => option.classList.add("disabled"));
		} else {
			// HANDLE INCORRECT
			this.feedback.className = "feedback incorrect";
			selectedOptionElement.classList.add("incorrect");

			// MARK AS ANSWERED (INCORRECTLY ON FIRST ATTEMPT)
			this.answered = true;

			// IF NOT CORRECT ANSWERED YET, DISABLE NEXT, FORCE TO GET CORRECT
            this.nextButton.disabled = !this.answeredCorrect;

			// DISABLE ONLY THE INCORRECT SELECTED OPTION
			selectedOptionElement.classList.add("disabled");
		}

		// Save progress
		this.saveProgress();
	}

	nextQuestion() {
		this.currentQuestionIndex++;
		this.displayQuestion();
	}

	showResults() {
		this.quizArea.style.display = "none";
		this.resultsArea.style.display = "block";

		this.scoreElement.textContent = this.firstAttemptCorrect; // Display first attempt correct score
		this.totalQuestionsElement.textContent = this.questions.length;

		// Clear saved progress
		localStorage.removeItem("quizProgress");

		// Add celebration effect for good scores
		const percentage = (this.firstAttemptCorrect / this.questions.length) * 100;
		if (percentage >= 80) {
			this.resultsArea.style.background = "linear-gradient(135deg, #28a745, #20c997)";
			this.resultsArea.style.color = "white";
			this.resultsArea.style.borderRadius = "15px";
			this.resultsArea.style.padding = "30px";
		}
	}

	restartQuiz() {
		this.currentQuestionIndex = 0;
		this.score = 0;
		this.firstAttemptCorrect = 0; // Reset first attempt correct score
		this.selectedAnswer = null;
		this.answered = false;

		this.quizArea.style.display = "block";
		this.resultsArea.style.display = "none";
		this.resultsArea.style.background = "";
		this.resultsArea.style.color = "";
		this.resultsArea.style.borderRadius = "";
		this.resultsArea.style.padding = "";

		// Reset answeredCorrectlyOnFirstAttempt for all questions and shuffle
		this.questions.forEach((q) => (q.answeredCorrectlyOnFirstAttempt = false));
		this.shuffleArray(this.questions);

		this.displayQuestion();
		localStorage.removeItem("quizProgress");
	}

	saveProgress() {
		const progress = {
			currentQuestionIndex: this.currentQuestionIndex,
			score: this.score,
			firstAttemptCorrect: this.firstAttemptCorrect, // Save first attempt correct score
			timestamp: Date.now(),
		};
		localStorage.setItem("quizProgress", JSON.stringify(progress));
	}

	loadProgress() {
		const saved = localStorage.getItem("quizProgress");
		if (saved) {
			const progress = JSON.parse(saved);

			// Only load if saved within last 24 hours
			const hoursSinceLastSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
			if (hoursSinceLastSave < 24) {
				this.currentQuestionIndex = progress.currentQuestionIndex;
				this.score = progress.score;
				this.firstAttemptCorrect = progress.firstAttemptCorrect || 0; // Load first attempt correct score
			}
		}
	}
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
	new QuizApp();
});

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
	if (e.key >= "1" && e.key <= "4") {
		const optionIndex = parseInt(e.key) - 1;
		const options = document.querySelectorAll(".option");
		if (options[optionIndex] && !options[optionIndex].classList.contains("disabled")) {
			options[optionIndex].click();
		}
	} else if (e.key === "Enter" || e.key === " ") {
		const nextButton = document.getElementById("next-button");
		const restartButton = document.getElementById("restart-button");

		if (nextButton && !nextButton.disabled && nextButton.offsetParent !== null) {
			e.preventDefault();
			nextButton.click();
		} else if (restartButton && restartButton.offsetParent !== null) {
			e.preventDefault();
			restartButton.click();
		}
	}
});

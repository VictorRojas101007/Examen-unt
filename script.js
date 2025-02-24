 // Estado inicial
 const state = {
    currentQuestion: 1,
    totalQuestions: 100,
    answers: new Array(100).fill(null),
    correctAnswers: 0,
    incorrectAnswers: 0,
    blankAnswers: 0
};

// Inicializar el resumen de preguntas
function initQuestionSummary() {
    const summaryContainer = document.getElementById('questionSummary');
    summaryContainer.innerHTML = '';
    for (let i = 1; i <= state.totalQuestions; i++) {
        const li = document.createElement('li');
        li.textContent = i;
        li.setAttribute('data-question', i);
        li.onclick = () => goToQuestion(i);
        if (i === state.currentQuestion) {
            li.classList.add('current');
        }
        if (state.answers[i - 1] === true) {
            li.classList.add('correct');
        } else if (state.answers[i - 1] === false) {
            li.classList.add('incorrect');
        } else if (state.answers[i - 1] === 'blank') {
            li.classList.add('blank');
        }
        summaryContainer.appendChild(li);
    }
}

// Ir a una pregunta específica
function goToQuestion(questionNumber) {
    state.currentQuestion = questionNumber;
    updateUI();
}

// Responder la pregunta actual
function answerQuestion(response) {
    state.answers[state.currentQuestion - 1] = response;

    // Actualizar contadores
    state.correctAnswers = state.answers.filter(a => a === true).length;
    state.incorrectAnswers = state.answers.filter(a => a === false).length;
    state.blankAnswers = state.answers.filter(a => a === 'blank').length;

    // Habilitar botón siguiente
    document.getElementById('nextBtn').disabled = false;

    updateUI();
}

// Navegar entre preguntas
function navigateQuestion(direction) {
    state.currentQuestion += direction;

    if (state.currentQuestion < 1) {
        state.currentQuestion = 1;
    } else if (state.currentQuestion > state.totalQuestions) {
        state.currentQuestion = state.totalQuestions;
    }

    updateUI();
}

// Actualizar la interfaz
function updateUI() {
    // Actualizar número de pregunta
    document.getElementById('questionNumber').textContent = `Pregunta ${state.currentQuestion} de ${state.totalQuestions}`;

    // Actualizar contadores
    document.getElementById('answeredCount').textContent = state.correctAnswers + state.incorrectAnswers + state.blankAnswers;
    document.getElementById('correctCount').textContent = state.correctAnswers;
    document.getElementById('incorrectCount').textContent = state.incorrectAnswers;
    document.getElementById('blankCount').textContent = state.blankAnswers;

    // Calcular puntuación
    const score = (state.correctAnswers * 4) - state.incorrectAnswers; // Las respuestas en blanco valen 0
    document.getElementById('currentScore').textContent = score;

    // Calcular puntuación máxima posible
    const remainingQuestions = state.totalQuestions - state.correctAnswers - state.incorrectAnswers - state.blankAnswers;
    const maxPossibleScore = score + (remainingQuestions * 4);
    document.getElementById('maxPossibleScore').textContent = maxPossibleScore;

    // Actualizar barra de progreso
    const progressPercentage = ((state.correctAnswers + state.incorrectAnswers + state.blankAnswers) / state.totalQuestions) * 100;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;

    // Habilitar/deshabilitar botones de navegación
    document.getElementById('prevBtn').disabled = state.currentQuestion === 1;
    document.getElementById('nextBtn').disabled = state.currentQuestion === state.totalQuestions || state.answers[state.currentQuestion - 1] === null;

    // Actualizar resumen de preguntas
    initQuestionSummary();

    // Desmarcar botones de opciones
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-incorrect', 'selected-blank');
    });

    // Marcar botón si la pregunta ya tiene respuesta
    const currentAnswer = state.answers[state.currentQuestion - 1];
    if (currentAnswer !== null) {
        if (currentAnswer === true) {
            optionButtons[0].classList.add('selected-correct');
        } else if (currentAnswer === false) {
            optionButtons[1].classList.add('selected-incorrect');
        } else if (currentAnswer === 'blank') {
            optionButtons[2].classList.add('selected-blank');
        }
    }
}

// Inicializar
initQuestionSummary();
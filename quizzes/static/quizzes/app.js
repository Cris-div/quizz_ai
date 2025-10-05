const apiBase = "http://127.0.0.1:8000/api/v1";
const quizContainer = document.getElementById("quiz-container");
const quizDetail = document.getElementById("quiz-detail");
const quizList = document.getElementById("quiz-list");
const quizTitle = document.getElementById("quiz-title");
const quizDesc = document.getElementById("quiz-description");
const quizForm = document.getElementById("quiz-form");
const resultDiv = document.getElementById("quiz-result");
const submitBtn = document.getElementById("submit-answers");

// 1️⃣ Mostrar lista de quizzes
async function loadQuizzes() {
  const res = await fetch(`${apiBase}/quizzes/`);
  const quizzes = await res.json();
  quizContainer.innerHTML = "";
  quizzes.results.forEach((quiz) => {
    const li = document.createElement("li");
    li.textContent = `${quiz.title}`;
    li.onclick = () => loadQuizDetail(quiz.id);
    quizContainer.appendChild(li);
  });
}

// 2️⃣ Mostrar preguntas del quiz
async function loadQuizDetail(id) {
  const res = await fetch(`${apiBase}/quizzes/${id}/`);
  const quiz = await res.json();

  quizList.classList.add("hidden");
  quizDetail.classList.remove("hidden");

  quizTitle.textContent = quiz.title;
  quizDesc.textContent = quiz.description;
  quizForm.innerHTML = "";
  resultDiv.innerHTML = "";

  quiz.questions.forEach((q) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<h4>${q.text}</h4>`;
    q.choices.forEach((c) => {
      div.innerHTML += `
        <div class="choice">
          <label>
            <input type="radio" name="question_${q.id}" value="${c.id}">
            ${c.text}
          </label>
        </div>`;
    });
    quizForm.appendChild(div);
  });

  submitBtn.onclick = () => submitAnswers(id, quiz.questions);
}

// 3️⃣ Enviar respuestas al backend
async function submitAnswers(quizId, questions) {
  const answers = [];
  questions.forEach((q) => {
    const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
    if (selected) {
      answers.push({ question_id: q.id, choice_id: parseInt(selected.value) });
    }
  });

  const res = await fetch(`${apiBase}/quizzes/${quizId}/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();

  resultDiv.innerHTML = `
    <h3>${data.emoji} ${data.message}</h3>
    <p><strong>Puntaje:</strong> ${data.score} (${data.percentage}%)</p>
    <p><strong>Nota:</strong> ${data.grade}</p>
  `;
}

// Iniciar
loadQuizzes();

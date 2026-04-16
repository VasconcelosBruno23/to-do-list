const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const priorityInput = document.getElementById("task-priority");
const deadlineInput = document.getElementById("task-deadline");
const message = document.getElementById("form-message");

const openList = document.getElementById("open-task-list");
const completedList = document.getElementById("completed-task-list");
const overdueList = document.getElementById("overdue-task-list");

const openCount = document.getElementById("open-count");
const completedCount = document.getElementById("completed-count");
const overdueCount = document.getElementById("overdue-count");
const totalCount = document.getElementById("total-count");

const openPageCount = document.getElementById("open-page-count");
const completedPageCount = document.getElementById("completed-page-count");
const overduePageCount = document.getElementById("overdue-page-count");
const openLimitInfo = document.getElementById("open-limit-info");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 🔹 NOVO: Formata prioridade para exibição
function formatPriority(priority) {
    if (priority === "alta") return "Alta";
    if (priority === "media") return "Média";
    return "Baixa";
}

// Salva tarefas
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Verifica se está vencida
function isOverdue(task) {
    if (task.completed || task.deadline === "") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(task.deadline + "T00:00:00");

    return deadlineDate < today;
}

// Atualiza contadores
function updateCounts() {
    let openTasks = tasks.filter(task => !task.completed && !isOverdue(task));
    let completedTasks = tasks.filter(task => task.completed);
    let overdueTasks = tasks.filter(task => !task.completed && isOverdue(task));

    if (openCount) openCount.textContent = openTasks.length + " / 10";
    if (completedCount) completedCount.textContent = completedTasks.length;
    if (overdueCount) overdueCount.textContent = overdueTasks.length;
    if (totalCount) totalCount.textContent = tasks.length + " tarefas";

    if (openPageCount) openPageCount.textContent = openTasks.length;
    if (completedPageCount) completedPageCount.textContent = completedTasks.length;
    if (overduePageCount) overduePageCount.textContent = overdueTasks.length;
    if (openLimitInfo) openLimitInfo.textContent = openTasks.length;
}

// Cria card
function createTaskCard(task) {
    let card = document.createElement("div");
    card.classList.add("task-card", task.priority);

    if (task.completed) card.classList.add("completed");
    if (isOverdue(task)) card.classList.add("overdue");

    let status = "Em aberto";
    if (task.completed) status = "Concluída";
    else if (isOverdue(task)) status = "Vencida";

    card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || "Sem descrição."}</p>
        <span>Prioridade: ${formatPriority(task.priority)}</span>
        <p>Prazo: ${task.deadline || "Sem prazo"}</p>
        <p>Status: ${status}</p>
        <div class="task-actions">
            ${!task.completed ? `<button onclick="completeTask(${task.id})">Concluir</button>` : ""}
            <button onclick="deleteTask(${task.id})">Excluir</button>
        </div>
    `;

    return card;
}

// Renderização
function renderTasks() {
    if (openList) {
        openList.innerHTML = "";
        let openTasks = tasks.filter(task => !task.completed && !isOverdue(task));

        if (openTasks.length === 0) {
            openList.innerHTML = "<p>Nenhuma tarefa em aberto.</p>";
        } else {
            openTasks.forEach(task => openList.appendChild(createTaskCard(task)));
        }
    }

    if (completedList) {
        completedList.innerHTML = "";
        let completedTasks = tasks.filter(task => task.completed);

        if (completedTasks.length === 0) {
            completedList.innerHTML = "<p>Nenhuma tarefa concluída.</p>";
        } else {
            completedTasks.forEach(task => completedList.appendChild(createTaskCard(task)));
        }
    }

    if (overdueList) {
        overdueList.innerHTML = "";
        let overdueTasks = tasks.filter(task => !task.completed && isOverdue(task));

        if (overdueTasks.length === 0) {
            overdueList.innerHTML = "<p>Nenhuma tarefa vencida.</p>";
        } else {
            overdueTasks.forEach(task => overdueList.appendChild(createTaskCard(task)));
        }
    }

    updateCounts();
}

// Adicionar tarefa
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let title = titleInput.value.trim();
        let description = descriptionInput.value.trim();
        let priority = priorityInput.value;
        let deadline = deadlineInput.value;

        let openTasks = tasks.filter(task => !task.completed).length;

        if (title === "") {
            message.textContent = "Digite uma tarefa antes de adicionar.";
            return;
        }

        if (openTasks >= 10) {
            message.textContent = "Você atingiu o limite de 10 tarefas.";
            return;
        }

        let newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            deadline,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        form.reset();
        message.textContent = "Tarefa adicionada com sucesso.";
    });
}

// Concluir
function completeTask(id) {
    tasks.forEach(task => {
        if (task.id === id) task.completed = true;
    });

    saveTasks();
    renderTasks();
}

// Excluir
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Inicialização
renderTasks();
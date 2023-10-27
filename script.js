document.getElementById("taskForm").addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", loadData);
document.getElementById("taskElement").addEventListener("click", toggleTaskDone)

function addTask(e) {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    // Check for duplicate tasks
    const existingTasks = document.querySelectorAll("#notDoneTasks .task label, #doneTasks .task label");
    for (const task of existingTasks) {
        if (task.innerText.trim().toLowerCase() === taskText.toLowerCase()) {
            alert("This task already exists!");
            taskInput.value = ""; 
            return;
        }
    }

    // If no duplicate is found, add the new task
    const taskElement = createTaskElement(taskText);
    document.getElementById("notDoneTasks").appendChild(taskElement);
    saveData();
    updateHeadersVisibility();

    taskInput.value = "";
}


function createTaskElement(taskText) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", toggleTaskDone);
    
    const taskLabel = document.createElement("label");
    taskLabel.innerText = taskText;
    
    const trashBin = document.createElement("span");
    trashBin.innerText = "🗑️";
    trashBin.className = "trashBin";
    trashBin.addEventListener("click", deleteTask);
    
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskLabel);
    taskDiv.appendChild(trashBin);
    
    // Make the entire task clickable to make it easier
    taskDiv.addEventListener("click", function(e) {
        if (e.target !== checkbox && e.target !== trashBin) { // Ensure checkbox and trashbin wont trigger this code (checkbox logic comes later)
            checkbox.checked = !checkbox.checked; // Toggle the checkbox
            
            // Manually trigger the change event on the checkbox
            const event = new Event('change');
            checkbox.dispatchEvent(event);
        }
    });
    
    return taskDiv;
}



function deleteTask(e) {
    // Commented out confirmation window. Less is more :)
    //if (confirm("Are you sure you want to delete this task?")) {
        e.target.parentElement.remove();
        saveData();
        updateHeadersVisibility();
    //}
}

function toggleTaskDone(e) {
    const taskDiv = e.target.parentElement;
    const taskLabel = taskDiv.querySelector("label");
    
    if (e.target.checked) {
        taskLabel.style.textDecoration = "line-through";
        taskLabel.style.color = "#999";
        document.getElementById("doneTasks").appendChild(taskDiv);
    } else {
        taskLabel.style.textDecoration = "none";
        taskLabel.style.color = "#000";
        document.getElementById("notDoneTasks").appendChild(taskDiv);
    }
    saveData();
    updateHeadersVisibility();
}

function updateHeadersVisibility() {
    const notDoneTasksHeader = document.querySelector("#notDoneTasks h3");
    const doneTasksHeader = document.querySelector("#doneTasks h3");
    
    if (document.querySelector("#notDoneTasks .task")) {
        notDoneTasksHeader.classList.remove("hidden");
    } else {
        notDoneTasksHeader.classList.add("hidden");
    }
    
    if (document.querySelector("#doneTasks .task")) {
        doneTasksHeader.classList.remove("hidden");
    } else {
        doneTasksHeader.classList.add("hidden");
    }
}

function saveData() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(taskDiv => {
        const checkbox = taskDiv.querySelector('input[type="checkbox"]');
        const label = taskDiv.querySelector("label");
        tasks.push({
            done: checkbox.checked,
            text: label.innerText
        });
    });
    localStorage.setItem("taskList", JSON.stringify(tasks));
}

function loadData() {
    const tasks = JSON.parse(localStorage.getItem("taskList") || "[]");
    tasks.forEach(task => {
        const taskDiv = createTaskElement(task.text);
        const checkbox = taskDiv.querySelector('input[type="checkbox"]');
        checkbox.checked = task.done;
        toggleTaskDone({ target: checkbox });
    });
    updateHeadersVisibility();
}

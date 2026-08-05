const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {

    if(taskInput.value.trim() === ""){
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerText = taskInput.value;

    span.onclick = function(){
        span.classList.toggle("completed");
        saveTasks();
    };

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.className = "delete";

    delBtn.onclick = function(){
        li.remove();
        saveTasks();
    };

    li.appendChild(span);
    li.appendChild(delBtn);

    taskList.appendChild(li);

    taskInput.value = "";

    saveTasks();
}

function saveTasks(){
    localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks(){
    taskList.innerHTML = localStorage.getItem("tasks") || "";

    document.querySelectorAll("#taskList span").forEach(span=>{
        span.onclick=function(){
            span.classList.toggle("completed");
            saveTasks();
        };
    });

    document.querySelectorAll(".delete").forEach(btn=>{
        btn.onclick=function(){
            btn.parentElement.remove();
            saveTasks();
        };
    });
}

loadTasks();
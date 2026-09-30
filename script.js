// ==============================
// GET HTML ELEMENTS
// ==============================

const taskInput = document.getElementById("taskInput");

const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const clearCompleted =
    document.getElementById("clearCompleted");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ==============================
// LOAD SAVED TASKS
// ==============================

let tasks =
    JSON.parse(localStorage.getItem("todoTasks")) || [];


// Current filter

let currentFilter = "all";


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


// ==============================
// ADD TASK
// ==============================

function addTask() {

    const text = taskInput.value.trim();


    // Don't allow empty tasks

    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    // Create task

    const task = {

        id: Date.now(),

        text: text,

        completed: false

    };


    // Add task to array

    tasks.push(task);


    // Save

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Update screen

    renderTasks();


    // Put cursor back in input

    taskInput.focus();

}


// ==============================
// DISPLAY TASKS
// ==============================

function renderTasks() {

    // Clear current list

    taskList.innerHTML = "";


    // Determine which tasks to display

    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(task => !task.completed);

    }


    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);

    }


    // ==============================
    // NO TASKS
    // ==============================

    if (filteredTasks.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.className =
            "empty-message";


        if (currentFilter === "all") {

            emptyMessage.textContent =
                "No tasks yet.";

        }


        if (currentFilter === "active") {

            emptyMessage.textContent =
                "No active tasks.";

        }


        if (currentFilter === "completed") {

            emptyMessage.textContent =
                "No completed tasks.";

        }


        taskList.appendChild(emptyMessage);

    }


    // ==============================
    // DISPLAY EACH TASK
    // ==============================

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");


        li.className = "task";


        // Add completed class

        if (task.completed) {

            li.classList.add("completed");

        }


        // ==============================
        // CHECKBOX
        // ==============================

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
            "task-checkbox";

        checkbox.checked =
            task.completed;


        checkbox.addEventListener(
            "change",
            function () {

                task.completed =
                    checkbox.checked;

                saveTasks();

                renderTasks();

            }
        );


        // ==============================
        // TASK TEXT
        // ==============================

        const span =
            document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // ==============================
        // BUTTON CONTAINER
        // ==============================

        const buttons =
            document.createElement("div");

        buttons.className =
            "task-buttons";


        // ==============================
        // EDIT BUTTON
        // ==============================

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.textContent =
            "Edit";


        editButton.addEventListener(
            "click",
            function () {

                const newText =
                    prompt(
                        "Edit your task:",
                        task.text
                    );


                if (
                    newText !== null &&
                    newText.trim() !== ""
                ) {

                    task.text =
                        newText.trim();

                    saveTasks();

                    renderTasks();

                }

            }
        );


        // ==============================
        // DELETE BUTTON
        // ==============================

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this task?"
                    );


                if (confirmDelete) {

                    tasks =
                        tasks.filter(
                            item =>
                                item.id !== task.id
                        );


                    saveTasks();

                    renderTasks();

                }

            }
        );


        // ==============================
        // PUT EVERYTHING TOGETHER
        // ==============================

        buttons.appendChild(editButton);

        buttons.appendChild(deleteButton);


        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(buttons);


        taskList.appendChild(li);

    });


    // ==============================
    // UPDATE TASK COUNTER
    // ==============================

    const remainingTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task left";

    } else {

        taskCount.textContent =
            remainingTasks +
            " tasks left";

    }

}


// ==============================
// ADD BUTTON EVENT
// ==============================

addButton.addEventListener(
    "click",
    addTask
);


// ==============================
// ENTER KEY
// ==============================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==============================
// FILTER BUTTONS
// ==============================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            // Remove active from all

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            // Add active to clicked button

            button.classList.add("active");


            // Change filter

            currentFilter =
                button.dataset.filter;


            // Update list

            renderTasks();

        }
    );

});


// ==============================
// CLEAR COMPLETED
// ==============================

clearCompleted.addEventListener(
    "click",
    function () {

        const completedTasks =
            tasks.filter(
                task => task.completed
            );


        if (completedTasks.length === 0) {

            alert(
                "There are no completed tasks."
            );

            return;
        }


        const confirmClear =
            confirm(
                "Clear all completed tasks?"
            );


        if (confirmClear) {

            tasks =
                tasks.filter(
                    task => !task.completed
                );


            saveTasks();

            renderTasks();

        }

    }
);


// ==============================
// START APP
// ==============================

renderTasks();
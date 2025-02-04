// FRONT-END (CLIENT) JAVASCRIPT HERE

// Global current table data
let tableCurr = [];

// we use async functions when we don't want JS to stop running and "wait forever" for a response
const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this dayNode server.js
    event.preventDefault()

    const taskInput = document.getElementById("task");
    const priorityInput = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");

    const task = taskInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    let isValid = true;

    // validation logic
    if (!task.trim()) {
        taskInput.classList.add("is-invalid");
        isValid = false;
    } else {
        taskInput.classList.remove("is-invalid");
    }

    if (priority === "Choose...") {
        priorityInput.classList.add("is-invalid");
        isValid = false;
    } else {
        priorityInput.classList.remove("is-invalid");
    }

    if (!deadline) {
        deadlineInput.classList.add("is-invalid");
        isValid = false;
    } else {
        deadlineInput.classList.remove("is-invalid");
    }

    if (isValid) {
        const json = { task: task, priority: priority, deadline: deadline }; // save input as JSON object
        const body = JSON.stringify(json); // convert JSON object to string
        console.log( "body:", body )

        const response = await fetch("/submit", {
            method: "POST",
            body,
        });

        const updatedData = await response.json(); // text from the response
        updateTable(updatedData);
        reset();
    }
}

const del = async function( event ) {
    event.preventDefault()

    const tidInput = document.getElementById("tid");
    const tid = tidInput.value;

    let isValid = true;

    // validation logic
    //!tid.trim() || isNaN(tid) || tid < 0 // unnecessary if we check tid exists in table
    console.log("tableCurr:", tableCurr);

    if(!isNaN(tid)){
        let n = Number(tid);

        if (!tableCurr.some(task => task.id === n)) {
            tidInput.classList.add("is-invalid");
            isValid = false;
        } else {
            tidInput.classList.remove("is-invalid");
        }

    }

    if (isValid) {
        const body = JSON.stringify({ id: tid });
        console.log( "body:", body )

        const response = await fetch("/delete", {
            method: "POST",
            body,
        });

        const updatedData = await response.json(); // text from the response
        updateTable(updatedData);
        reset();
    }
}

// Function to update the table dynamically
const updateTable = (data) => {
    const demo = document.querySelector("#todo-list");
    tableCurr = data;
    demo.innerHTML =
        `${data.map(task => `
                    <tr>
                        <td>${task.id}</td>
                        <td>${task.task}</td>
                        <td>${task.priority}</td>
                        <td>${task.deadline}</td>
                        <td>${task.daysLeft}</td>
                    </tr>`).join('')}
    `;
};

const reset = function() {
    document.querySelector("#task").classList.remove("is-invalid");
    document.querySelector("#priority").classList.remove("is-invalid");
    document.querySelector("#deadline").classList.remove("is-invalid");
    document.getElementById("reset").click();
    document.querySelector("#tid").classList.remove("is-invalid");
    document.getElementById("resetdelete").click();
}


window.onload = function () {
    const submitBtn = document.querySelector("#submit");
    submitBtn.onclick = submit;

    const resetBtn = document.querySelector("#reset");
    resetBtn.onclick = reset;

    const deleteBtn = document.querySelector("#delete");
    deleteBtn.onclick = del;

    const resetDeleteBtn = document.querySelector("#resetdelete");
    resetDeleteBtn.onclick = reset;

    // Fetch existing data from the server without using async/await
    fetch("/results")
        .then(response => response.json())
        .then(data => {
            tableCurr = data;
            updateTable(data);
            //console.log("Data fetched:", data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// FRONT-END (CLIENT) JAVASCRIPT HEREd

// we use async functions when we don't want JS to stop running and "wait forever" for a response
const validate = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this dayNode server.js
    event.preventDefault()

    const taskInput = document.getElementById("task");
    const priorityInput = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");

    let task = taskInput.value;
    let priority = priorityInput.value;
    let deadline = deadlineInput.value;

    let isValid = true;

    // Validate Task
    if (!task.trim()) {
        taskInput.classList.add("is-invalid");
        isValid = false;
    } else {
        taskInput.classList.remove("is-invalid");
    }

    // Validate Priority
    if (priority === "Choose...") {
        priorityInput.classList.add("is-invalid");
        isValid = false;
    } else {
        priorityInput.classList.remove("is-invalid");
    }

    // Validate Deadline
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

        const response = await fetch( "/submit", {
            method:'POST',
            body
        });

        const updatedData = await response.json(); // text from the response
        console.log( "updatedData:", updatedData );
        updateTable(updatedData);
        reset();
    }
}

// Function to update the table dynamically
const updateTable = (data) => {
    const demo = document.querySelector("#todo-list");
    demo.innerHTML =
        `${data.map(task => `
                    <tr>
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
}


window.onload = function () {
    const submit = document.querySelector("#submit");
    submit.onclick = validate;

    const reset = document.querySelector("#reset");
    reset.onclick = reset;

    // Fetch existing data from the server without using async/await
    fetch("/results")
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            //console.log("Data fetched:", data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

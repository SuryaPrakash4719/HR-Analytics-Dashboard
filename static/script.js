console.log("JavaScript connected");

/* Dashboard html */
console.log("javascript connected")

// Dashboard - Dynamic Performance Chart

const dashboardPerformanceDataElement =
    document.getElementById("dashboardPerformanceData");

if (dashboardPerformanceDataElement) {

    const dashboardPerformanceData = JSON.parse(
        dashboardPerformanceDataElement.textContent
    );

    const performanceChart =
        document.getElementById("performanceChart");

    if (performanceChart) {

        const labels = dashboardPerformanceData.map(
            item => item.performance_level
        );

        const data = dashboardPerformanceData.map(
            item => item.total
        );

        new Chart(performanceChart, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Employees",
                    data: data
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Dashboard - Dynamic Attendance Chart

const dashboardAttendanceDataElement =
    document.getElementById("dashboardAttendanceData");

if (dashboardAttendanceDataElement) {

    const dashboardAttendanceData = JSON.parse(
        dashboardAttendanceDataElement.textContent
    );

    const attendanceChart =
        document.getElementById("attendanceChart");

    if (attendanceChart) {

        const labels = dashboardAttendanceData.map(
            item => item.status
        );

        const data = dashboardAttendanceData.map(
            item => item.total
        );

        new Chart(attendanceChart, {
            type: "doughnut",

            data: {
                labels: labels,

                datasets: [{
                    label: "Attendance",
                    data: data
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/*====================================================================================*/

/* Employee html */
const addButton = document.querySelector(".add-btn");
const employeeForm = document.getElementById("employeeForm");

if (addButton && employeeForm) {

    employeeForm.style.display = "none";

    addButton.addEventListener("click", function () {
        if(employeeForm.style.display === "none") {
            employeeForm.style.display = "block";
        } 
        else {
            employeeForm.style.display = "none";
        }
    });
}
/* Save Button */
const saveButton = document.getElementById("saveEmployee");
const employeeTable = document.getElementById("employeeTable");

if (saveButton && employeeTable) {

    saveButton.addEventListener("click", function () {

        const employeeId = document.getElementById("employeeId").value;
        const employeeName = document.getElementById("employeeName").value;
        const department = document.getElementById("department").value;
        const position = document.getElementById("position").value;
        const status = document.getElementById("status").value;
        const newRow = employeeTable.insertRow();

        document.getElementById("employeeId").value = "";
        document.getElementById("employeeName").value = "";
        document.getElementById("department").value = "";
        document.getElementById("position").value = "";


        newRow.insertCell(0).textContent = employeeId;
        newRow.insertCell(1).textContent = employeeName;
        newRow.insertCell(2).textContent = department;
        newRow.insertCell(3).textContent = position;
        newRow.insertCell(4).textContent = status;

        const actionCell = newRow.insertCell(5);

        actionCell.innerHTML = '<button class="delete-btn" onclick="deleteEmployee(this)">Delete</button>';
    });
}
/* Delete Button */
function deleteEmployee(button) {
    button.parentElement.parentElement.remove();
}

/*===============================================================================*/

// Analytics - Department Chart

const departmentDataElement = document.getElementById("departmentData");

if (departmentDataElement) {

    const departmentData = JSON.parse(
        departmentDataElement.textContent
    );

    const departmentChart = document.getElementById("departmentChart");

    if (departmentChart) {

        new Chart(departmentChart, {
            type: "line",

            data: {
                labels: departmentData.map(item => item.department),

                datasets: [{
                    label: "Employees",
                    data: departmentData.map(item => item.total)
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/*============================================================*/
// Analytics - Attendance Chart

// Analytics - Attendance Chart

const attendanceDataElement = document.getElementById("attendanceData");

if (attendanceDataElement) {

    const attendanceData = JSON.parse(
        attendanceDataElement.textContent
    );

    const attendanceAnalyticsChart =
        document.getElementById("attendanceAnalyticsChart");

    if (attendanceAnalyticsChart) {

        const labels = attendanceData.map(item => item.status);
        const data = attendanceData.map(item => item.total);

        new Chart(attendanceAnalyticsChart, {
            type: "doughnut",

            data: {
                labels: labels,

                datasets: [{
                    label: "Attendance",
                    data: data
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
/*================================================================*/

// Analytics - Leave Chart

const leaveDataElement = document.getElementById("leaveData");

if (leaveDataElement) {

    const leaveData = JSON.parse(
        leaveDataElement.textContent
    );

    const leaveChart = document.getElementById("leaveChart");

    if (leaveChart) {

        const labels = leaveData.map(item => item.leave_type);
        const data = leaveData.map(item => item.total);

        new Chart(leaveChart, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Employees",
                    data: data
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/*===============================================================*/

// Analytics - Performance Chart

const performanceDataElement = document.getElementById("performanceData");

if (performanceDataElement) {

    const performanceData = JSON.parse(
        performanceDataElement.textContent
    );

    const performanceAnalyticsChart =
        document.getElementById("performanceAnalyticsChart");

    if (performanceAnalyticsChart) {

        const labels = performanceData.map(
            item => item.performance_level
        );

        const data = performanceData.map(
            item => item.total
        );

        new Chart(performanceAnalyticsChart, {
            type: "pie",

            data: {
                labels: labels,

                datasets: [{
                    label: "Employees",
                    data: data
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// AI Chat Box

// ================================
// AI Chat Box
// ================================

async function sendMessage() {

    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const userMessage = input.value.trim();

    if (userMessage === "") {
        return;
    }

    // -------------------------------
    // User Message
    // -------------------------------

    const userDiv = document.createElement("div");

    userDiv.className = "user-message";

    userDiv.textContent = userMessage;

    messages.appendChild(userDiv);


    // -------------------------------
    // Get latest data from MySQL
    // -------------------------------

    try {

        const response = await fetch("/chatbot_data");

        if (!response.ok) {

            throw new Error(
                "Chatbot data request failed"
            );

        }

        const data = await response.json();


        // -------------------------------
        // Bot Message
        // -------------------------------

        const botDiv = document.createElement("div");

        botDiv.className = "bot-message";


        const message = userMessage.toLowerCase();

        let reply = "";


        // -------------------------------
        // Employee
        // -------------------------------

        if (message.includes("employee")) {

            if (message.includes("how many")) {

                reply = data.employees;

            } else {

                reply =
                    "There are " +
                    data.employees +
                    " employees in the organisation.";

            }


        // -------------------------------
        // Attendance
        // -------------------------------

        } else if (message.includes("attendance")) {

            if (message.includes("how many")) {

                reply = data.present;

            } else {

                reply =
                    "Today's attendance is " +
                    data.present +
                    " employees present.";

            }


        // -------------------------------
        // Leave
        // -------------------------------

        } else if (message.includes("leave")) {

            if (message.includes("how many")) {

                reply = data.leave;

            } else {

                reply =
                    "Currently, " +
                    data.leave +
                    " employees are on leave.";

            }


        // -------------------------------
        // Performance
        // -------------------------------

        } else if (message.includes("performance")) {

            if (message.includes("how many")) {

                reply = data.performance + "%";

            } else {

                reply =
                    "The average employee performance is " +
                    data.performance +
                    "%.";

            }


        // -------------------------------
        // Greeting
        // -------------------------------

        } else if (
            message.includes("hello") ||
            message.includes("hi") ||
            message.includes("hey")
        ) {

            reply =
                "Hello! 👋🏻 How can I help you with HR information?";


        // -------------------------------
        // Unknown question
        // -------------------------------

        } else {

            reply =
                "Sorry, I don't have information about that yet.";

        }


        // -------------------------------
        // Display Bot Message
        // -------------------------------

        botDiv.textContent = reply;

        messages.appendChild(botDiv);


        // Clear input

        input.value = "";


        // Scroll to latest message

        messages.scrollTop =
            messages.scrollHeight;


    } catch (error) {

        console.error(
            "Chatbot Error:",
            error
        );


        // Error message

        const botDiv =
            document.createElement("div");

        botDiv.className =
            "bot-message";

        botDiv.textContent =
            "Sorry, I couldn't connect to the HR database.";

        messages.appendChild(botDiv);

    }
}


// ================================
// Enter Key
// ================================

const chatInput =
    document.getElementById("chatInput");

if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                sendMessage();

            }

        }
    );

}


// ================================
// Toggle Chatbot
// ================================

function toggleChat() {

    const chatbot =
        document.querySelector(".chatbot");

    if (chatbot) {

        chatbot.classList.toggle(
            "chat-hidden"
        );

    }

}


// ================================
// Hide Chatbot Initially
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const chatbot =
            document.querySelector(".chatbot");

        if (chatbot) {

            chatbot.classList.add(
                "chat-hidden"
            );

        }

    }
);

// ================================
// Toggle Chatbot
// ================================

function toggleChat() {

    const chatbot =
        document.querySelector(".chatbot");

    if (chatbot) {

        chatbot.classList.toggle(
            "chat-hidden"
        );

    }

}


// ================================
// Hide Chatbot Initially
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const chatbot =
            document.querySelector(".chatbot");

        if (chatbot) {

            chatbot.classList.add(
                "chat-hidden"
            );

        }

    }
);

// Show / Hide Password

        const showPassword = document.getElementById("showPassword");
        const password = document.getElementById("password");
        const passwordIcon = document.getElementById("passwordIcon");

        if (showPassword && password && passwordIcon) {
            showPassword.addEventListener("click", function () {
            
                if (password.type === "password") {
                    password.type = "text";
                    passwordIcon.src = "/static/eye3.png";
                } else {
                    password.type = "password";
                    passwordIcon.src = "/static/eyeof.png";  
                }
            });
        }    
        // Demo Login
        const demoLogin = document.getElementById("demoLogin");
        if (demoLogin) {
            demoLogin.addEventListener("click", function () {
                document.getElementById("username").value = "admin";
                document.getElementById("password").value = "admin123";
            });
        }

// Login

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin123") {
            window.location.href = "/dashboard";
        } else {
            alert("Invalid username or password");
        }
    });
}

/*========================================================================*/
/* ATTENDANCE DASHBOARD */
const addAttendanceBtn = document.getElementById("addAttendanceBtn");
const attendanceForm = document.getElementById("attendanceForm");

if (addAttendanceBtn && attendanceForm) {

    addAttendanceBtn.addEventListener("click", function() {

        if (attendanceForm.style.display === "none" ||
            attendanceForm.style.display === "") {

            attendanceForm.style.display = "block";

        } else {

            attendanceForm.style.display = "none";

        }

    });

}

const saveAttendance = document.getElementById("saveAttendance");
const attendanceTable = document.querySelector("table tbody");

if (saveAttendance && attendanceTable) {

    saveAttendance.addEventListener("click", function () {

        const employeeId = document.getElementById("attendanceEmployeeId").value;
        const employeeName = document.getElementById("attendanceEmployeeName").value;
        const date = document.getElementById("attendanceDate").value;
        const checkIn = document.getElementById("checkIn").value;
        const checkOut = document.getElementById("checkOut").value;
        const status = document.getElementById("attendanceStatus").value;

        const newRow = attendanceTable.insertRow();

        newRow.insertCell(0).textContent = employeeId;
        newRow.insertCell(1).textContent = employeeName;
        newRow.insertCell(2).textContent = date;
        newRow.insertCell(3).textContent = checkIn;
        newRow.insertCell(4).textContent = checkOut;
        newRow.insertCell(5).textContent = status;

        const actionCell = newRow.insertCell(6);

        actionCell.innerHTML =
            '<button class="delete-btn" onclick="deleteAttendance(this)">Delete</button>';

        document.getElementById("attendanceEmployeeId").value = "";
        document.getElementById("attendanceEmployeeName").value = "";
        document.getElementById("attendanceDate").value = "";
        document.getElementById("checkIn").value = "";
        document.getElementById("checkOut").value = "";
        document.getElementById("attendanceStatus").value = "Present";

    });

}

function deleteAttendance(button) {
    button.parentElement.parentElement.remove();
}



/*============================================================*/

/* LEAVE DASHBOARD */
console.log("Leave JS loaded");

const addLeaveBtn = document.getElementById("addLeaveBtn");
const leaveForm = document.getElementById("leaveForm");

if (addLeaveBtn && leaveForm) {

    addLeaveBtn.addEventListener("click", function () {

        if (leaveForm.style.display === "none" ||
            leaveForm.style.display === "") {

            leaveForm.style.display = "block";

        } else {

            leaveForm.style.display = "none";

        }

    });

}


const saveLeave = document.getElementById("saveLeave");
const leaveTable = document.getElementById("leaveTable");

if (saveLeave && leaveTable) {

    saveLeave.addEventListener("click", function () {

        const employeeId =
            document.getElementById("leaveEmployeeId").value;

        const employeeName =
            document.getElementById("leaveEmployeeName").value;

        const leaveType =
            document.getElementById("leaveType").value;

        const fromDate =
            document.getElementById("fromDate").value;

        const toDate =
            document.getElementById("toDate").value;

        const reason =
            document.getElementById("leaveReason").value;

        const status =
            document.getElementById("leaveStatus").value;


        const newRow = leaveTable.insertRow();

        newRow.insertCell(0).textContent = employeeId;
        newRow.insertCell(1).textContent = employeeName;
        newRow.insertCell(2).textContent = leaveType;
        newRow.insertCell(3).textContent = fromDate;
        newRow.insertCell(4).textContent = toDate;
        newRow.insertCell(5).textContent = reason;
        newRow.insertCell(6).textContent = status;


        const actionCell = newRow.insertCell(7);

        actionCell.innerHTML =
            '<button class="delete-btn" onclick="deleteLeave(this)">Delete</button>';


        /* CLEAR FORM */

        document.getElementById("leaveEmployeeId").value = "";
        document.getElementById("leaveEmployeeName").value = "";
        document.getElementById("leaveType").value = "Casual Leave";
        document.getElementById("fromDate").value = "";
        document.getElementById("toDate").value = "";
        document.getElementById("leaveReason").value = "";
        document.getElementById("leaveStatus").value = "Pending";

    });

}


/* DELETE LEAVE */

function deleteLeave(button) {

    button.parentElement.parentElement.remove();

}

/* =============================================================
   PERFORMANCE DASHBOARD
================================================================ */

const addPerformanceBtn = document.getElementById("addPerformanceBtn");
const performanceForm = document.getElementById("performanceForm");

if (addPerformanceBtn && performanceForm) {

    performanceForm.style.display = "none";

    addPerformanceBtn.addEventListener("click", function () {

        if (performanceForm.style.display === "none" ||
            performanceForm.style.display === "") {

            performanceForm.style.display = "block";

        } else {

            performanceForm.style.display = "none";

        }

    });
}

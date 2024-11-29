// DOM Elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add Task Function
function addTask() {
  const taskText = inputBox.value.trim(); // Trim input to avoid empty spaces
  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  // Create task list item
  const listItem = document.createElement("li");
  listItem.textContent = taskText;

  // Create and append delete button (span)
  const span = document.createElement("span");
  span.textContent = "X";
  listItem.appendChild(span);

  // Add to the list
  listContainer.appendChild(listItem);

  // Clear input and save data
  inputBox.value = "";
  saveData();
}

// Handle List Item Clicks
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked"); // Toggle completed state
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove(); // Remove task
      saveData();
    }
  },
  false
);

// Share Tasks Function
function shareTasks() {
  const tasks = Array.from(listContainer.children).map((li) => ({
    text: li.textContent.replace("X", "").trim(),
    checked: li.classList.contains("checked"),
  }));

  const encodedTasks = encodeURIComponent(JSON.stringify(tasks));
  const shareUrl = `${window.location.origin}${window.location.pathname}?tasks=${encodedTasks}`;

  // Display the shareable link
  const shareLink = document.getElementById("share-link");
  const shareUrlElement = document.getElementById("share-url");
  const copyButton = document.getElementById("copy-btn");

  shareUrlElement.href = shareUrl;
  shareUrlElement.textContent = shareUrl;
  shareLink.style.display = "block";
  copyButton.style.display = "inline-block";
}

// Load Tasks from Query Parameter
function loadTasksFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const tasksParam = urlParams.get("tasks");

  if (tasksParam) {
    try {
      const tasks = JSON.parse(decodeURIComponent(tasksParam));
      listContainer.innerHTML = ""; // Clear existing tasks

      tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.textContent = task.text;

        if (task.checked) {
          listItem.classList.add("checked");
        }

        const span = document.createElement("span");
        span.textContent = "X";
        listItem.appendChild(span);

        listContainer.appendChild(listItem);
      });
    } catch (error) {
      console.error("Failed to parse tasks from query parameter:", error);
    }
  }
}

// Copy Shareable Link to Clipboard
function copyToClipboard() {
  const shareUrlElement = document.getElementById("share-url");
  navigator.clipboard.writeText(shareUrlElement.href).then(() => {
    alert("Link copied to clipboard!");
  });
}

// Save and Load Data with Local Storage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showData() {
  const savedData = localStorage.getItem("data");
  if (savedData) {
    listContainer.innerHTML = savedData;
  }
}

// Initialize the App
function initialize() {
  showData(); // Load data from local storage
  loadTasksFromQuery(); // Check for query parameters
}

// Run initialization on page load
initialize();

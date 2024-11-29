const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add a new task
function addTask() {
  if (inputBox.value === "") {
    alert("Please enter a task");
  } else {
    let listItem = document.createElement("li");
    listItem.innerHTML = inputBox.value;
    listContainer.appendChild(listItem);

    let span = document.createElement("span");
    span.innerHTML = "X";
    listItem.appendChild(span);
  }
  inputBox.value = ""; // Clear input
  saveData(); // Save to local storage
}

// Handle clicks on tasks (toggle checked or delete)
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

// Share the tasks via a link
function shareTasks() {
  const tasks = Array.from(listContainer.children).map((li) => ({
    text: li.textContent.replace("X", "").trim(),
    checked: li.classList.contains("checked"),
  }));

  const encodedTasks = encodeURIComponent(JSON.stringify(tasks));
  const shareUrl = `${window.location.origin}${window.location.pathname}?tasks=${encodedTasks}`;

  const shareLink = document.getElementById("share-link");
  const shareUrlElement = document.getElementById("share-url");
  const copyButton = document.getElementById("copy-btn");

  shareUrlElement.href = shareUrl;
  shareUrlElement.textContent = shareUrl;
  shareLink.style.display = "block";
  copyButton.style.display = "inline-block";
}

// Load tasks from query parameters and sync with existing tasks
function loadTasksFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const tasksParam = urlParams.get("tasks");

  if (tasksParam) {
    try {
      const tasks = JSON.parse(decodeURIComponent(tasksParam));
      const existingTasks = Array.from(listContainer.children);

      // Add a divider if there are existing tasks
      if (existingTasks.length > 0) {
        const divider = document.createElement("li");
        // divider.textContent = "---- Shared Tasks Below ----";
        divider.classList.add("divider"); // Add a specific class for styling
        divider.style.textAlign = "center";
        divider.style.color = "gray";
        divider.style.margin = "10px 0";
        divider.style.pointerEvents = "none"; // Prevent clicks or interactions
        divider.style.userSelect = "none"; // Prevent text selection
        listContainer.appendChild(divider);
      }

      // Append shared tasks
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

      // Save the combined list
      saveData();
      return true;
    } catch (error) {
      console.error("Failed to parse tasks from query parameter:", error);
    }
  }
  return false; // No tasks loaded
}

// Copy the share link to the clipboard
function copyToClipboard() {
  const shareUrlElement = document.getElementById("share-url");
  navigator.clipboard.writeText(shareUrlElement.href).then(() => {
    alert("Link copied to clipboard!");
  });
}

// Save data to local storage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Show saved data from local storage when the page loads
function showData() {
  const savedData = localStorage.getItem("data");
  if (savedData) {
    listContainer.innerHTML = savedData;
  }
}

// Clear query parameters from the URL after loading tasks
function clearQueryParameters() {
  setTimeout(() => {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState(null, "", url.toString());
  }, 2000); // Delay to ensure tasks are loaded first
}

// Initialize the app
function initialize() {
  showData(); // Load tasks from local storage
  const loadedFromQuery = loadTasksFromQuery(); // Load shared tasks
  if (loadedFromQuery) {
    clearQueryParameters(); // Clear the query parameters if tasks were loaded
  }
}

// Call initialize on page load
initialize();

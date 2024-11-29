# using Node.js

To enable sharing your to-do list with friends while extending your existing project, you can incorporate a backend server and database to store and share the list. Here's a step-by-step guide:

### Step 1: Modify Your Frontend for Sharing
You need to add functionality in your HTML and JavaScript to allow users to generate a shareable link.

#### Updated HTML
Add a **Share** button to generate a link and display it to the user.
```html
<div class="row">
  <input type="text" id="input-box" placeholder="What to Do ?" />
  <button id="add-btn" onclick="addTask()">Add</button>
</div>
<button id="share-btn" onclick="shareTasks()">Share</button>
<p id="share-link" style="display: none;">Link: <a id="share-url" href="#" target="_blank"></a></p>
```

#### Updated JavaScript
Include a function to send the to-do list to a server and retrieve a shareable URL.
```javascript
async function shareTasks() {
  const tasks = listContainer.innerHTML; // Get the current to-do list
  try {
    const response = await fetch("https://your-server-url.com/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });
    const result = await response.json();
    const shareUrl = `https://your-app-url.com/view/${result.id}`;
    const shareLink = document.getElementById("share-link");
    const shareUrlElement = document.getElementById("share-url");

    shareUrlElement.href = shareUrl;
    shareUrlElement.textContent = shareUrl;
    shareLink.style.display = "block"; // Display the shareable link
  } catch (error) {
    alert("Error sharing tasks: " + error.message);
  }
}
```

### Step 2: Build a Backend for Sharing
You'll need a server to store the to-do lists and serve them through unique links.

#### Example Backend with Node.js
Set up a backend server using **Node.js** and **Express** with a simple database (like MongoDB or even a JSON file for small projects).

1. **Install Dependencies**
   ```bash
   npm install express body-parser cors mongodb
   ```

2. **Create the Server**
   ```javascript
   const express = require("express");
   const bodyParser = require("body-parser");
   const { MongoClient, ObjectId } = require("mongodb");
   const cors = require("cors");

   const app = express();
   const port = 3000;

   app.use(cors());
   app.use(bodyParser.json());

   const uri = "your-mongodb-connection-string";
   const client = new MongoClient(uri);

   let db;
   client.connect().then(() => {
     db = client.db("todoApp");
     console.log("Connected to database");
   });

   // Save tasks
   app.post("/share", async (req, res) => {
     try {
       const { tasks } = req.body;
       const result = await db.collection("tasks").insertOne({ tasks });
       res.json({ id: result.insertedId });
     } catch (error) {
       res.status(500).send("Error saving tasks: " + error.message);
     }
   });

   // Get tasks by ID
   app.get("/view/:id", async (req, res) => {
     try {
       const id = req.params.id;
       const taskData = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
       if (taskData) {
         res.json(taskData);
       } else {
         res.status(404).send("Task not found");
       }
     } catch (error) {
       res.status(500).send("Error retrieving tasks: " + error.message);
     }
   });

   app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
   ```

### Step 3: Handle Viewing Shared Tasks
Add a separate page in your frontend to view a shared to-do list.

#### HTML for Viewing Shared Tasks
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared To-Do List</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="todo-app">
      <h2>Shared To-Do List</h2>
      <ul id="shared-list-container"></ul>
    </div>
  </div>
  <script src="shared.js"></script>
</body>
</html>
```

#### JavaScript for Viewing Shared Tasks
Fetch the tasks using the ID from the URL.
```javascript
async function loadSharedTasks() {
  const id = window.location.pathname.split("/").pop(); // Get the ID from URL
  try {
    const response = await fetch(`https://your-server-url.com/view/${id}`);
    const data = await response.json();
    const listContainer = document.getElementById("shared-list-container");
    listContainer.innerHTML = data.tasks;
  } catch (error) {
    alert("Error loading shared tasks: " + error.message);
  }
}

loadSharedTasks();
```

### Step 4: Deploy the Backend and Frontend
1. **Frontend**: Deploy on GitHub Pages or Vercel.
2. **Backend**: Deploy on services like Heroku, Render, or AWS.

### Additional Enhancements
- Add user authentication to track ownership of lists.
- Use WebSockets to allow real-time collaboration on lists.
- Enable editing of shared lists if permissions allow.

This implementation allows you to share your to-do list with friends seamlessly!

---
---

# Without Backend

Passing data through the query parameters is a lightweight, backend-free approach that can be fun and quick to implement for your project. While it has limitations, it can work well for sharing small datasets like your to-do list. Here’s how you can achieve this:

### Advantages of Using Query Parameters
1. **No Backend Needed**: Everything happens on the frontend.
2. **Easily Shareable**: Users can copy and share the generated link.
3. **Simple Implementation**: Minimal changes to your current project.

### Limitations
1. **Data Length**: Query parameters have a length limit (around 2000 characters in most browsers).
2. **No Security**: The data is visible and can be edited in the URL.
3. **Non-Persistent**: Changes made by the recipient won’t reflect in the sender’s list.

If you’re okay with these trade-offs, here’s how you can implement this:

---

### Step 1: Generate a Shareable Link with Query Parameters
Modify your JavaScript to encode the to-do list into a query parameter.

#### Updated JavaScript
```javascript
function shareTasks() {
  const tasks = Array.from(listContainer.children).map((li) => ({
    text: li.textContent.replace("X", "").trim(),
    checked: li.classList.contains("checked"),
  }));

  const encodedTasks = encodeURIComponent(JSON.stringify(tasks));
  const shareUrl = `${window.location.origin}${window.location.pathname}?tasks=${encodedTasks}`;

  const shareLink = document.getElementById("share-link");
  const shareUrlElement = document.getElementById("share-url");

  shareUrlElement.href = shareUrl;
  shareUrlElement.textContent = shareUrl;
  shareLink.style.display = "block"; // Display the shareable link
}
```

---

### Step 2: Load Tasks from Query Parameters
When the page loads, check if a `tasks` query parameter exists and populate the list accordingly.

#### Updated JavaScript
```javascript
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

// Call this function on page load
loadTasksFromQuery();
```

---

### Step 3: Full Integration
Here’s how your updated project will work:
1. Users create their to-do list.
2. Clicking the "Share" button generates a link with the to-do list encoded in the query parameter.
3. Another user opens the link, and the to-do list is populated on their page.

---

### Final Example
#### Link Generation Example
If the to-do list contains:
- Task 1 (checked)
- Task 2 (unchecked)

The generated link might look like this:
```
http://yourdomain.com/index.html?tasks=%5B%7B%22text%22%3A%22Task%201%22%2C%22checked%22%3Atrue%7D%2C%7B%22text%22%3A%22Task%202%22%2C%22checked%22%3Afalse%7D%5D
```

#### Decoding Process
When the link is opened:
1. The `loadTasksFromQuery` function decodes the `tasks` parameter.
2. The list is populated dynamically.

---

### Step 4: Styling and Usability
To make the shared link feature more user-friendly:
1. Use a URL shortener API (optional).
2. Add a "Copy Link" button for convenience:
   ```javascript
   function copyToClipboard() {
     const shareUrlElement = document.getElementById("share-url");
     navigator.clipboard.writeText(shareUrlElement.href).then(() => {
       alert("Link copied to clipboard!");
     });
   }
   ```

   Add this button to your HTML:
   ```html
   <button onclick="copyToClipboard()">Copy Link</button>
   ```

---

This solution is simple, backend-free, and effective for fun and personal projects!
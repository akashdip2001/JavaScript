const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if(inputBox.value === "") { // If the input box is empty
    alert("Please enter a task");
  } else {
    let listItem = document.createElement("li"); // store the text in listitem variable.
    listItem.innerHTML = inputBox.value; // Add the text to the list item
    listContainer.appendChild(listItem); // Add the listitem to the list-container (html)

    let span = document.createElement("span"); // Create a span element
    span.innerHTML = "X"; // Add the text to the span element
    listItem.appendChild(span); // Add the span element to the list item
  }
  inputBox.value = ""; // Clear the input box after adding the task
}
const inputTask = document.querySelector(".todo-input");
const todoContainer = document.querySelector(".todoList");
const saveBtn = document.querySelector(".addBtn");

const userNameInput = document.querySelector(".username-input");
const createUserBtn = document.querySelector(".create-user-btn");
const userSelect = document.querySelector("#userSelect");
const switchUserBtn = document.querySelector(".switch-user-btn");
const currentUser = document.querySelector(".current-user");

let users = [{ id: "admin", username: "Admin", role: "admin" }];
let todos = [];
let currentUserId = "admin";

function saveData() {
  localStorage.setItem("todoUsers", JSON.stringify(users));
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("currentTodoUser", currentUserId);
}

function loadData() {
  const savedUsers = localStorage.getItem("todoUsers");
  const savedTodos = localStorage.getItem("todos");
  const savedCurrentUser = localStorage.getItem("currentTodoUser");

  if (savedUsers) {
    users = JSON.parse(savedUsers);
  }

  if (savedTodos) {
    todos = JSON.parse(savedTodos);
  }

  if (savedCurrentUser) {
    currentUserId = savedCurrentUser;
  }
}

loadData();
saveData();
console.log(users);
console.log(todos);
console.log(currentUserId);

function renderData() {
  userSelect.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.username;

    userSelect.appendChild(option);
  });

  userSelect.value = currentUserId;
  const selectedUser = users.find((user) => user.id === currentUserId);

  currentUser.textContent =
    selectedUser.role === "admin"
      ? "Current User: Admin (viewing all todos)"
      : "Current User: " + selectedUser.username;
}

createUserBtn.addEventListener("click", () => {
  const username = userNameInput.value.trim();
  if (username === "") {
    alert("Please enter a username");
    return;
  }

  const userExists = users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );

  if (userExists) {
    alert("This username is already exist");
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    username: username,
    role: "user",
  };

  users.push(newUser);

  currentUserId = newUser.id;
  saveData();
  renderData();

  userNameInput.value = "";
  alert("User created successfully!");
});

renderData();

switchUserBtn.addEventListener("click", () => {
  currentUserId = userSelect.value;
  saveData();
  renderData();
  alert("User switched successfully!");
});

saveBtn.addEventListener("click", () => {
  if (inputTask.value.trim() !== "" && !/\d/.test(inputTask.value)) {
    const li = document.createElement("li");
    const todoText = document.createElement("span");
    todoText.innerText = inputTask.value;

    const doneBtn = document.createElement("button");
    doneBtn.innerText = "Done";
    doneBtn.classList.add("done");
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit");
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("delete");

    const btnWrapper = document.createElement("div");

    btnWrapper.appendChild(doneBtn);
    btnWrapper.appendChild(editBtn);
    btnWrapper.appendChild(delBtn);
    li.appendChild(todoText);
    li.appendChild(btnWrapper);

    todoContainer.appendChild(li);

    inputTask.value = "";

    doneBtn.addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    editBtn.addEventListener("click", () => {
      if (editBtn.innerText === "Edit") {
        const input = document.createElement("input");
        input.value = todoText.innerText;
        todoText.replaceWith(input);

        editBtn.innerText = "Save";
        editBtn.classList.add("save");

        editBtn.inputElement = input;
      } else {
        const input = editBtn.inputElement;

        if (input.value.trim() === "") {
          alert("Todo cannot be empty");
          return;
        }

        if (/\d/.test(input.value)) {
          alert("Numbers are not allowed");
          return;
        }

        todoText.innerText = input.value.trim();
        input.replaceWith(todoText);

        editBtn.innerText = "Edit";
        editBtn.classList.remove("save");
        delete editBtn.inputElement;
      }
    });

    delBtn.addEventListener("click", () => {
      li.remove();
    });
  } else {
    alert(`Please enter a valid task (no numbers or empty input)`);
    inputTask.value = "";
  }
});

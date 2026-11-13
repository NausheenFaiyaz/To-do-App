const inputTask = document.querySelector(".todo-input");
const todoContainer = document.querySelector(".todoList");
const saveBtn = document.querySelector(".addBtn");

const userNameInput = document.querySelector(".username-input");
const createUserBtn = document.querySelector(".create-user-btn");
const userSelect = document.querySelector("#userSelect");
const switchUserBtn = document.querySelector(".switch-user-btn");
const currentUser = document.querySelector(".current-user");

const adminViewToggle = document.querySelector(".admin-view-toggle");
const personalViewBtn = document.querySelector(".personal-view-btn");
const adminViewBtn = document.querySelector(".admin-view-btn");

let users = [];
let todos = [];
let currentUserId = "";
let adminView = "personal";

function generateId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

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

  let admin = users.find((user) => user.role === "admin");

  if (!admin) {
    admin = {
      id: generateId(),
      username: "Admin",
      role: "admin",
    };
    users.unshift(admin);
  }

  if (savedCurrentUser && users.some((user) => user.id === savedCurrentUser)) {
    currentUserId = savedCurrentUser;
  } else {
    currentUserId = admin.id;
  }
}

function getCurrentUser() {
  return users.find((user) => user.id === currentUserId);
}

// console.log(users);
// console.log(todos);
// console.log(currentUserId);

function renderData() {
  userSelect.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.username;

    userSelect.appendChild(option);
  });

  userSelect.value = currentUserId;
  const selectedUser = getCurrentUser();

  adminViewToggle.hidden = selectedUser.role !== "admin";
  if (selectedUser.role !== "admin") {
    adminView = "personal";
  }

  currentUser.textContent =
    selectedUser.role === "admin"
      ? "Current User: Admin (viewing all todos)"
      : "Current User: " + selectedUser.username;
}

function renderTodos() {
  todoContainer.innerHTML = "";
  const selectedUser = getCurrentUser();

  const isAdmin = selectedUser.role === "admin";
  const isAdminPreview = isAdmin && adminView === "admin";
  const visibleTodos = isAdminPreview
    ? todos
    : todos.filter((todo) => todo.userId === currentUserId);

  visibleTodos.forEach((todo) => {
    const li = document.createElement("li");
    const todoText = document.createElement("span");
    todoText.textContent = todo.text;

    if (todo.completed) {
      li.classList.add("completed");
    }

    if (isAdminPreview) {
      const owner = users.find((user) => user.id === todo.userId);
      const ownerLabel = document.createElement("small");
      ownerLabel.textContent = "Owner: " + (owner ? owner.username : "Uknown");
      ownerLabel.style.color = "#333";
      li.appendChild(ownerLabel);
    }

    const btnWrapper = document.createElement("div");
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.classList.add("done");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete");

    if (isAdminPreview && todo.userId !== currentUserId) {
      doneBtn.disabled = true;
      editBtn.disabled = true;
      delBtn.disabled = true;
    }

    btnWrapper.append(doneBtn, editBtn, delBtn);
    li.append(todoText, btnWrapper);
    todoContainer.appendChild(li);

    doneBtn.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveData();
      renderTodos();
    });

    editBtn.addEventListener("click", () => {
      if (editBtn.textContent === "Edit") {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = todo.text;
        todoText.replaceWith(editInput);

        editBtn.textContent = "Save";
        editBtn.classList.remove("edit");
        editBtn.classList.add("save");

        editBtn.inputElement = editInput;
      } else {
        const editInput = editBtn.inputElement;
        const newText = editInput.value.trim();

        if (!newText) {
          alert("Todo cannot be empty");
          return;
        }

        if (/\d/.test(newText)) {
          alert("Numbers are not allowed");
          return;
        }

        todo.text = newText;
        saveData();
        renderTodos();
      }
    });

    delBtn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this task?")) {
        return;
      }

      todos = todos.filter((item) => item.id !== todo.id);
      saveData();
      renderTodos();
    });
  });
}

createUserBtn.addEventListener("click", () => {
  const username = userNameInput.value.trim();
  if (!username) {
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
    id: generateId(),
    username: username,
    role: "user",
  };

  users.push(newUser);

  currentUserId = newUser.id;
  userNameInput.value = "";
  saveData();
  renderData();
  renderTodos();

  alert("User created successfully!");
});

switchUserBtn.addEventListener("click", () => {
  currentUserId = userSelect.value;
  saveData();
  renderData();
  renderTodos();
  alert("User switched successfully!");
});

personalViewBtn.addEventListener("click", ()=>{
  adminView = "personal";
  renderTodos();
})

adminViewBtn.addEventListener("click",()=>{
  adminView ="admin";
  renderTodos();
})

saveBtn.addEventListener("click", () => {
  const task = inputTask.value.trim();
  const selectedUser = getCurrentUser();
 if(selectedUser.role === 'admin'){
  alert("Switch to as regular user to add todos.");
  inputTask.value = "";
  return;
 }

  if (!task || /\d/.test(task)) {
    alert("Please enter a valid task (no numbers or empty input).");
    inputTask.value = "";
    return;
  }

  const newTodo = {
    id: Date.now().toString(),
    userId: currentUserId,
    text: task,
    completed: false,
  };

  todos.push(newTodo);
  inputTask.value = "";
  saveData();
  renderTodos();
});

loadData();
saveData();
renderData();
renderTodos();

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

  if (!users.some((user) => user.id === "admin")) {
    users.unshift({
      id: "admin",
      username: "Admin",
      role: "admin",
    });
  }

  if (savedCurrentUser && users.some((user) => user.id === savedCurrentUser)) {
    currentUserId = savedCurrentUser;
  } else {
    currentUserId = "admin";
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

  currentUser.textContent =
    selectedUser.role === "admin"
      ? "Current User: Admin (viewing all todos)"
      : "Current User: " + selectedUser.username;
}

function renderTodos() {
  todoContainer.innerHTML = "";
  const selectedUser = getCurrentUser();
  const visibleTodos =
    selectedUser.role === "admin"
      ? todos
      : todos.filter((todo) => todo.userId === currentUserId);

  visibleTodos.forEach((todo) => {
    const li = document.createElement("li");
    const todoText = document.createElement("span");
    todoText.textContent = todo.text;

    if (todo.completed) {
      li.classList.add("completed");
    }

    if (selectedUser.role === "admin") {
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

    if (selectedUser.role === "admin") {
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
    id: Date.now().toString(),
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

saveBtn.addEventListener("click", () => {
  const task = inputTask.value.trim();
  const selectedUser = getCurrentUser();
  if (selectedUser.role === "admin") {
    alert("Switch to a regular user to add todos.");
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

// saveBtn.addEventListener("click", () => {
//   if (inputTask.value.trim() !== "" && !/\d/.test(inputTask.value)) {
//     const li = document.createElement("li");
//     const todoText = document.createElement("span");
//     todoText.innerText = inputTask.value;

//     const doneBtn = document.createElement("button");
//     doneBtn.innerText = "Done";
//     doneBtn.classList.add("done");
//     const editBtn = document.createElement("button");
//     editBtn.innerText = "Edit";
//     editBtn.classList.add("edit");
//     const delBtn = document.createElement("button");
//     delBtn.innerText = "Delete";
//     delBtn.classList.add("delete");

//     const btnWrapper = document.createElement("div");

//     btnWrapper.appendChild(doneBtn);
//     btnWrapper.appendChild(editBtn);
//     btnWrapper.appendChild(delBtn);
//     li.appendChild(todoText);
//     li.appendChild(btnWrapper);

//     todoContainer.appendChild(li);

//     inputTask.value = "";

//     doneBtn.addEventListener("click", () => {
//       li.classList.toggle("completed");
//     });

//     editBtn.addEventListener("click", () => {
//       if (editBtn.innerText === "Edit") {
//         const input = document.createElement("input");
//         input.value = todoText.innerText;
//         todoText.replaceWith(input);

//         editBtn.innerText = "Save";
//         editBtn.classList.add("save");

//         editBtn.inputElement = input;
//       } else {
//         const input = editBtn.inputElement;

//         if (input.value.trim() === "") {
//           alert("Todo cannot be empty");
//           return;
//         }

//         if (/\d/.test(input.value)) {
//           alert("Numbers are not allowed");
//           return;
//         }

//         todoText.innerText = input.value.trim();
//         input.replaceWith(todoText);

//         editBtn.innerText = "Edit";
//         editBtn.classList.remove("save");
//         delete editBtn.inputElement;
//       }
//     });

//     delBtn.addEventListener("click", () => {
//       li.remove();
//     });
//   } else {
//     alert(`Please enter a valid task (no numbers or empty input)`);
//     inputTask.value = "";
//   }
// });

const inputTask = document.querySelector(".todo-input");
const todoContainer = document.querySelector(".todoList");
const saveBtn = document.querySelector(".addBtn");

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

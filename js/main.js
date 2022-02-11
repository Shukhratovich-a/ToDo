// SELECT ELEMENTS
const elTodosForm = selectElement(".todo__form");
const elTodosInput = selectElement(".todo__input", elTodosForm);
const elTodosList = selectElement(".todo__list");
const elTodoCheckedCount = selectElement(".todo__checked-count span");
const elTodoOptions = selectElement(".todo__options");
const elTodoSortButtons = selectElements(".todo__option__button");
const elTodosClearButton = selectElement(".todo__bottom__button");
const elTodosCheckAllButton = selectElement(".todo__top__button");

// TEMPLATES
const elTodoTemplate = selectElement("#todo-template").content;

const todos = !localStorage.todos ? [] : JSON.parse(window.localStorage.getItem("todos"));

// UPDATE LOCAL
const updateLocal = () => window.localStorage.setItem("todos", JSON.stringify(todos));

// RENDER TODOS
const renderTodos = (array, list) => {
  // Clear list
  list.innerHTML = null;

  const todosFragment = document.createDocumentFragment();

  array.forEach((todo, index) => {
    // Clone template
    const todoTemplate = elTodoTemplate.cloneNode(true);

    // Set contents
    selectElement(".todo__item__text", todoTemplate).textContent = todo.todoDescription;
    selectElement(".todo__item__text", todoTemplate).title = todo.todoDescription;
    selectElement(".todo__item__label", todoTemplate).htmlFor = "checkbox-" + todo.id;
    selectElement(".todo__item__checkbox", todoTemplate).id = "checkbox-" + todo.id;
    selectElement(".todo__item__checkbox", todoTemplate).onclick = () => completedTodo(todo.id);
    selectElement(".todo__item__checkbox", todoTemplate).checked = todo.isCompleted;
    selectElement(".todo__item__button", todoTemplate).onclick = () => deleteTodo(todo.id);

    // Append to fragment
    todosFragment.appendChild(todoTemplate);
  });

  // Append to list
  elTodosList.append(todosFragment);
};

// SET ID
const setId = (array) => (array[array.length - 1] ? array[array.length - 1].id : 0) + 1;

// ADD NEW TODO
const addNewTodo = (array = [], input) => {
  const newTodoDescription = input.value.trim();

  // New todo
  const newTodo = {
    id: setId(array),
    todoDescription: newTodoDescription,
    isCompleted: false,
  };

  array.push(newTodo);
  updateLocal();
};

// DELETE TODO
const deleteTodo = (id) => {
  const foundTodoIndex = todos.findIndex((todo) => todo.id === id);

  // Delete clicked element
  todos.splice(foundTodoIndex, 1);

  complateFunctions();
};

// COMPLETED TODO
const completedTodo = (id) => {
  const foundTodoIndex = todos.findIndex((todo) => todo.id === id);

  todos[foundTodoIndex].isCompleted = !todos[foundTodoIndex].isCompleted;

  complateFunctions();
};

// SET ACTIVE LIST CLASS
const activeList = (array, list) => {
  if (array.length > 0) list.classList.add("todo__list--active");
  else list.classList.remove("todo__list--active");
};

// CELAR INPUT
const clearInput = (input) => (input.value = null);

// REDNER NEW TODO
const renderNewTodo = (evt) => {
  evt.preventDefault();

  if (!elTodosInput.value) return;

  addNewTodo(todos, elTodosInput);
  clearInput(elTodosInput);
  complateFunctions();
};

elTodosForm.addEventListener("submit", renderNewTodo);

// COLLECT SORTED TODOS
const collectSortedTodos = (array = [], property = "all") => {
  if (property === "all") return array.filter((todo) => todo);
  if (property === "active") return array.filter((todo) => !todo.isCompleted);
  if (property === "completed") return array.filter((todo) => todo.isCompleted);
};

// RENDER SORTED TODOS
const renderSortedTodos = (button) => {
  renderTodos(collectSortedTodos(todos, button.name), elTodosList);
};

// ADD SELECTED BUTTON STYLE
const addSortButtonStyle = (button) => {
  elTodoSortButtons.forEach((item) => {
    if (item.name === button.name) item.classList.add("todo__option__button--active");
    else item.classList.remove("todo__option__button--active");
  });
};

// SELECT ACTIVE BUTTON
const selectActiveButton = () => {
  return selectElement(".todo__option__button--active");
};

// SORT TODOS
const sortTodos = (evt) => {
  const sortButton = evt.target;

  renderSortedTodos(sortButton);
  addSortButtonStyle(sortButton);
};

// SET ACTIVE TASKS COUNT
const setActiveTodosCount = () => {
  elTodoCheckedCount.textContent = collectSortedTodos(todos, "active").length;
};

elTodoOptions.addEventListener("click", sortTodos);

// CLEAR DISPLAY MODE
const clearCompletedDisplay = (button) => {
  if (collectSortedTodos(todos, "completed").length) button.classList.add("todo__bottom__button--active");
  else button.classList.remove("todo__bottom__button--active");
};

const clearComplated = (evt) => {
  evt.preventDefault();

  collectSortedTodos(todos, "completed").forEach((todo) => deleteTodo(todo.id));
};

elTodosClearButton.addEventListener("click", clearComplated);

// SELECT ALL
const selectAllButtonDisplay = (button) => {
  if (todos.length) {
    button.classList.add("todo__top__button--active");
  } else {
    button.classList.remove("todo__top__button--active");
  }

  if (todos.length === collectSortedTodos(todos, "completed").length) {
    button.classList.add("todo__top__button--checked");
  } else {
    button.classList.remove("todo__top__button--checked");
  }
};

// CHECK ALL
const checkAll = (evt) => {
  evt.preventDefault();

  todos.forEach((todo) => {
    if (elTodosCheckAllButton.matches(".todo__top__button--checked")) todo.isCompleted = false;
    else todo.isCompleted = true;
  });

  complateFunctions();
};

elTodosCheckAllButton.addEventListener("click", checkAll);

const complateFunctions = () => {
  return (
    renderSortedTodos(selectActiveButton()),
    activeList(todos, elTodosList),
    setActiveTodosCount(),
    clearCompletedDisplay(elTodosClearButton),
    selectAllButtonDisplay(elTodosCheckAllButton),
    updateLocal()
  );
};

elTodoSortButtons[0].classList.add("todo__option__button--active");
complateFunctions();

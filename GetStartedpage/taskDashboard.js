

                    //  Get userId from localStorage after login
                    const userId = localStorage.getItem("userId");

                    if (!userId) {
                      alert("You must log in first!");
                      window.location.href = "login.html"; // redirect if not logged in
                    }

                    const API_URL = `http://localhost:8080/users/${userId}/todos`;

                    const form = document.getElementById('taskForm');
                    const taskInput = document.getElementById('taskInput');
                    const descInput = document.getElementById('descInput');
                    const dueInput = document.getElementById('dueInput');
                    const todosContainer = document.querySelector('.myTodos');

                    //  Load tasks from backend on page load
                    window.addEventListener('DOMContentLoaded', loadTasks);

                    async function loadTasks() {
                      try {
                        const response = await fetch(API_URL);
                        const todos = await response.json();
                        todosContainer.innerHTML = `
                          <div class="todo-row header">
                            <div>Task</div>
                            <div>Description</div>
                            <div>Created</div>
                            <div>Due Date</div>
                            <div>Action</div>
                          </div>
                        `;
                        todos.forEach(addTodoToDOM);
                      } catch (error) {
                        console.error("Failed to load tasks:", error);
                      }
                    }

                    //  Add new task
                    form.addEventListener('submit', async function (e) {
                      e.preventDefault();

                      const payload = {
                        title: taskInput.value,
                        description: descInput.value,
                        dueDate: dueInput.value + "T00:00:00"
                      };

                      try {
                        const response = await fetch(API_URL, {
                          method: 'POST',
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                          const newTodo = await response.json();
                          addTodoToDOM(newTodo);
                          form.reset();
                        } else {
                          alert("Failed to add task");
                        }
                      } catch (err) {
                        console.error("Error adding task:", err);
                      }
                    });


                    function addTodoToDOM(todo) {
                      const row = document.createElement('div');
                      row.className = 'todo-row';
                      row.dataset.id = todo.id;

                      if(todo.completed) {
                        row.classList.add("completed");
                      }

                      // console.log(todo);
                      row.innerHTML = `
                        <div>${todo.title}</div>
                        <div>${todo.description}</div>
                        <div>${new Date().getDate}</div>
                        <div>${todo.dueDate}</div>
                        <div>
                          <button class="complete-btn">${todo.completed ? "✔ Done" : "Mark Complete"}</button>
                          <button class="edit-btn">Edit</button>
                          <button class="delete-btn">Delete</button>
                        </div>
                      `;

                      //  Delete
                      row.querySelector('.delete-btn').addEventListener('click', async () => {
                        try {
                          await fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' });
                          row.remove();
                        } catch (err) {
                          console.error("Delete failed:", err);
                        }
                      });

                      //  Edit
                      row.querySelector('.edit-btn').addEventListener('click', async () => {
                        const newTask = prompt("Edit task name:", todo.title);
                        const newDesc = prompt("Edit description:", todo.description);
                        const newDue = prompt("Edit due date (YYYY-MM-DD):", todo.dueDate);
                        if (!newTask) return;

                        try {
                          const updated = await fetch(`${API_URL}/${todo.id}`, {
                            method: 'PUT',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...todo, title: newTask })
                          });
                          const updatedTodo = await updated.json();
                          row.children[0].textContent = updatedTodo.title;
                        } catch (err) {
                          console.error("Update failed:", err);
                        }
                      });

                      // Mark Complete
                      row.querySelector('.complete-btn').addEventListener('click', async () => {
                        try {
                          const res = await fetch(`${API_URL}/${todo.id}/complete`, {
                            method: 'PUT'
                          });
                          const completedTodo = await res.json();
                          row.querySelector('.complete-btn').textContent = "✔ Done";
                          row.classList.add("completed");
                        } catch (err) {
                          console.error("Failed to complete task:", err);
                        }
                      });

                      todosContainer.appendChild(row);
                    }


                    //  Search
                    const searchBtn = document.getElementById('searchBtn');
                    const searchInput = document.getElementById('searchInput');

                    searchBtn.addEventListener('click', () => {
                      const searchTerm = searchInput.value.toLowerCase();
                      const taskRows = document.querySelectorAll('.myTodos .todo-row:not(.header)');

                      taskRows.forEach(row => {
                        const taskName = row.children[0].textContent.toLowerCase();
                        const description = row.children[1].textContent.toLowerCase();
                        row.style.display = (taskName.includes(searchTerm) || description.includes(searchTerm)) ? '' : 'none';
                      });
                    });


                    //  Logout
                    document.getElementById("logoutBtn").addEventListener("click", () => {
                      localStorage.clear();
                      window.location.href = "login.html";
                    });

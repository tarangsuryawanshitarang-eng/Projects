// ===== Todo List JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('add-todo-form');
    const input = document.getElementById('todo-input');
    const prioritySelect = document.getElementById('todo-priority');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('empty-state');
    const filteredEmpty = document.getElementById('filtered-empty');
    const todoFooter = document.getElementById('todo-footer');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const totalTasks = document.getElementById('total-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const currentDateEl = document.getElementById('current-date');
    const toastContainer = document.getElementById('toast-container');

    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Initialize
    init();

    function init() {
        setCurrentDate();
        renderTodos();
        updateStats();
    }

    function setCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    // Add todo
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = input.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now(),
            text,
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        todos.unshift(newTodo);
        saveTodos();
        renderTodos();
        updateStats();
        
        input.value = '';
        input.focus();
        
        showToast('Task added successfully!', 'success');
    });

    // Render todos
    function renderTodos() {
        const filteredTodos = getFilteredTodos();
        
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            emptyState.style.display = 'block';
            filteredEmpty.style.display = 'none';
            todoFooter.style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        todoFooter.style.display = 'flex';
        
        if (filteredTodos.length === 0) {
            filteredEmpty.style.display = 'block';
            return;
        }
        
        filteredEmpty.style.display = 'none';
        
        filteredTodos.forEach((todo, index) => {
            const li = createTodoElement(todo);
            li.style.animationDelay = `${index * 0.05}s`;
            todoList.appendChild(li);
        });
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <label class="todo-checkbox">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <span class="priority-indicator ${todo.priority}"></span>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-action-btn edit" aria-label="Edit task">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="todo-action-btn delete" aria-label="Delete task">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `;

        // Event listeners
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const deleteBtn = li.querySelector('.delete');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id, li));

        const editBtn = li.querySelector('.edit');
        editBtn.addEventListener('click', () => editTodo(todo.id, li));

        return li;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getFilteredTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }

    // Toggle todo
    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
        updateStats();
    }

    // Delete todo
    function deleteTodo(id, element) {
        element.classList.add('removing');
        
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
            showToast('Task deleted', 'info');
        }, 300);
    }

    // Edit todo
    function editTodo(id, element) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const textSpan = element.querySelector('.todo-text');
        const currentText = todo.text;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.className = 'edit-input';
        editInput.style.cssText = `
            flex: 1;
            padding: 4px 8px;
            border: 2px solid var(--primary);
            border-radius: 8px;
            font-size: inherit;
        `;

        textSpan.replaceWith(editInput);
        editInput.focus();
        editInput.select();

        function saveEdit() {
            const newText = editInput.value.trim();
            if (newText && newText !== currentText) {
                todos = todos.map(t => 
                    t.id === id ? { ...t, text: newText } : t
                );
                saveTodos();
                showToast('Task updated', 'success');
            }
            renderTodos();
        }

        editInput.addEventListener('blur', saveEdit);
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                renderTodos();
            }
        });
    }

    // Filter todos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Clear completed
    clearCompletedBtn.addEventListener('click', () => {
        const completedCount = todos.filter(t => t.completed).length;
        if (completedCount === 0) return;

        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateStats();
        showToast(`${completedCount} task(s) cleared`, 'info');
    });

    // Update stats
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalTasks.textContent = total;
        completedTasks.textContent = completed;
        itemsLeft.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% complete`;
    }

    // Save to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : 
                  type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Focus input on /
        if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });
});

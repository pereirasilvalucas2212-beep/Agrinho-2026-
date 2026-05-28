// ==================== Todo App State ==================== 
let todos = [];
const STORAGE_KEY = 'todos_app';
let currentFilter = 'all';

// ==================== DOM Elements ==================== 
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const noResults = document.getElementById('noResults');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// ==================== Local Storage Functions ==================== 
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
}

// ==================== Todo CRUD Operations ==================== 
function addTodo(text, priority = 'medium') {
    if (text.trim() === '') {
        showNotification('Please enter a task!', 'warning');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
    updateStats();
    showNotification('Task added successfully!', 'success');
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
    showNotification('Task deleted!', 'info');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

function clearCompleted() {
    const count = todos.filter(t => t.completed).length;
    if (count === 0) {
        showNotification('No completed tasks to clear!', 'warning');
        return;
    }

    if (confirm(`Delete ${count} completed task(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
        updateStats();
        showNotification(`${count} task(s) deleted!`, 'success');
    }
}

function deleteAll() {
    if (todos.length === 0) {
        showNotification('No tasks to delete!', 'warning');
        return;
    }

    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
        todos = [];
        saveTodos();
        renderTodos();
        updateStats();
        showNotification('All tasks deleted!', 'success');
    }
}

// ==================== Render Functions ==================== 
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    todoList.innerHTML = '';

    if (todos.length === 0) {
        emptyState.style.display = 'block';
        noResults.style.display = 'none';
        return;
    }

    if (filteredTodos.length === 0) {
        emptyState.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    noResults.style.display = 'none';

    filteredTodos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.id = `todo-${todo.id}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const priority = document.createElement('span');
    priority.className = `todo-priority priority-${todo.priority}`;
    priority.textContent = todo.priority;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-todo-btn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => {
        li.classList.add('removing');
        setTimeout(() => deleteTodo(todo.id), 300);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(priority);
    li.appendChild(deleteBtn);

    return li;
}

// ==================== Filter Functions ==================== 
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

function setFilter(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// ==================== Statistics ==================== 
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-progress').textContent = `${progress}%`;

    // Update filter counts
    document.getElementById('count-all').textContent = total;
    document.getElementById('count-active').textContent = active;
    document.getElementById('count-completed').textContent = completed;
}

// ==================== Notifications ==================== 
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const style = document.createElement('style');
    if (!document.getElementById('notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideInUp 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            
            .notification-warning {
                border-left: 4px solid #f59e0b;
                color: #92400e;
            }
            
            .notification-info {
                border-left: 4px solid #6366f1;
                color: #312e81;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== Event Listeners ==================== 
addBtn.addEventListener('click', () => {
    addTodo(todoInput.value);
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo(todoInput.value);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);
deleteAllBtn.addEventListener('click', deleteAll);

// ==================== Priority Selection (Enhancement) ==================== 
todoInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        todoInput.dataset.priority = 'high';
        showNotification('Priority set to HIGH', 'info');
    } else if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        todoInput.dataset.priority = 'medium';
        showNotification('Priority set to MEDIUM', 'info');
    } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        todoInput.dataset.priority = 'low';
        showNotification('Priority set to LOW', 'info');
    }
});

// ==================== Initialize App ==================== 
function initializeApp() {
    loadTodos();
    renderTodos();
    updateStats();
    todoInput.focus();
    console.log('📋 Todo App initialized successfully!');
    console.log('💡 Tip: Use Ctrl+H for High, Ctrl+M for Medium, Ctrl+L for Low priority');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
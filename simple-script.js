// Simple Todo App with Login and AI Chatbot
class SimpleTodoApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.init();
    }

    init() {
        console.log('App initializing...');
        this.bindEvents();
        this.showLoginPage();
        this.loadDemoUser();
    }

    loadDemoUser() {
        // Create demo user for testing
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (!users.find(u => u.email === 'demo@example.com')) {
            users.push({
                id: 'demo123',
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'demo123' // Simple password for demo
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('authLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('authRegisterForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Task form
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
        }

        // Edit task form
        const editTaskForm = document.getElementById('editTaskForm');
        if (editTaskForm) {
            editTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEditedTask();
            });
        }

        // Edit modal close buttons
        const editModal = document.getElementById('editModal');
        if (editModal) {
            const closeBtn = editModal.querySelector('.close');
            const cancelBtn = document.getElementById('cancelEdit');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeEditModal());
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.closeEditModal());
            }

            // Close modal when clicking outside
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    this.closeEditModal();
                }
            });
        }

        // Analytics modal close buttons
        const analyticsModal = document.getElementById('analyticsModal');
        if (analyticsModal) {
            const closeBtn = analyticsModal.querySelector('.close');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    analyticsModal.style.display = 'none';
                });
            }

            // Close modal when clicking outside
            analyticsModal.addEventListener('click', (e) => {
                if (e.target === analyticsModal) {
                    analyticsModal.style.display = 'none';
                }
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Login attempt:', email);

        // Simple validation
        if (email === 'demo@example.com' && password === 'password123') {
            this.currentUser = { id: 'demo123', name: 'Demo User', email: email };
            this.showMessage('Login successful!', 'success');
            this.loadUserTasks();
            this.showMainApp();
        } else {
            this.showMessage('Invalid credentials!', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters!', 'error');
            return;
        }

        this.currentUser = { id: Date.now(), name: name, email: email };
        this.showMessage('Account created successfully!', 'success');
        this.showMainApp();
    }

    loginAsGuest() {
        this.currentUser = { id: 'guest', name: 'Guest User', email: 'guest@example.com' };
        this.showMessage('Welcome, Guest!', 'success');
        this.loadUserTasks();
        this.showMainApp();
    }

    logout() {
        this.currentUser = null;
        this.tasks = [];
        this.showLoginPage();
        this.showMessage('Logged out successfully!', 'success');
    }

    showLoginPage() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // Update user name
        const userName = document.getElementById('userName');
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }
        
        this.renderTasks();
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const priority = document.getElementById('taskPriority').value;
        const category = document.getElementById('taskCategory').value;

        if (!title) {
            this.showMessage('Please enter a task title!', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            title: title,
            description: description,
            date: date,
            time: time,
            priority: priority,
            category: category,
            completed: false,
            userId: this.currentUser.id
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.clearTaskForm();
        this.showMessage('Task added successfully!', 'success');
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const noTasks = document.getElementById('noTasks');
        
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = '';
            if (noTasks) noTasks.style.display = 'block';
            return;
        }

        if (noTasks) noTasks.style.display = 'none';
        
        container.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <div class="task-info">
                        <h3 class="task-title">${task.title}</h3>
                        ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                        <div class="task-meta">
                            ${task.date ? `<span class="task-meta-item"><i class="fas fa-calendar"></i> ${task.date}</span>` : ''}
                            ${task.time ? `<span class="task-meta-item"><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
                            <span class="priority ${task.priority}">${this.getPriorityIcon(task.priority)} ${task.priority}</span>
                            <span class="category-badge ${task.category}">${this.getCategoryIcon(task.category)} ${task.category}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-sm btn-info" onclick="todoApp.editTask(${task.id})" title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}" onclick="todoApp.toggleTask(${task.id})" title="${task.completed ? 'Mark as Pending' : 'Mark as Complete'}">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="todoApp.deleteTask(${task.id})" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateStats();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.showMessage(`Task ${task.completed ? 'completed' : 'reopened'}!`, 'success');
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.showMessage('Task deleted!', 'success');
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        // Fill the edit modal with task data
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskDate').value = task.date || '';
        document.getElementById('editTaskTime').value = task.time || '';
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskCategory').value = task.category;

        // Store the task ID for saving
        this.editingTaskId = id;

        // Show the modal
        document.getElementById('editModal').style.display = 'block';
    }

    saveEditedTask() {
        if (!this.editingTaskId) return;

        const title = document.getElementById('editTaskTitle').value.trim();
        if (!title) {
            this.showMessage('Task title is required!', 'error');
            return;
        }

        const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
        if (taskIndex === -1) return;

        // Update the task
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            title,
            description: document.getElementById('editTaskDescription').value.trim(),
            date: document.getElementById('editTaskDate').value,
            time: document.getElementById('editTaskTime').value,
            priority: document.getElementById('editTaskPriority').value,
            category: document.getElementById('editTaskCategory').value
        };

        this.saveTasks();
        this.renderTasks();
        this.closeEditModal();
        this.showMessage('Task updated successfully!', 'success');
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Update stat cards
        this.updateElement('totalTasks', total);
        this.updateElement('pendingTasks', pending);
        this.updateElement('completedTasks', completed);
        this.updateElement('completionRate', completionRate + '%');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    getPriorityIcon(priority) {
        const icons = { high: '🔴', medium: '🟡', low: '🟢' };
        return icons[priority] || '⚪';
    }

    getCategoryIcon(category) {
        const icons = {
            personal: '👤', work: '💼', shopping: '🛒',
            health: '🏥', education: '📚', other: '📋'
        };
        return icons[category] || '📋';
    }

    clearTaskForm() {
        document.getElementById('taskForm').reset();
    }

    loadUserTasks() {
        if (this.currentUser) {
            this.tasks = JSON.parse(localStorage.getItem(`tasks_${this.currentUser.id}`)) || [];
        }
    }

    saveTasks() {
        if (this.currentUser) {
            localStorage.setItem(`tasks_${this.currentUser.id}`, JSON.stringify(this.tasks));
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.showMessage('All tasks cleared!', 'success');
        }
    }

    exportTasks() {
        if (this.tasks.length === 0) {
            this.showMessage('No tasks to export!', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showMessage('Tasks exported successfully!', 'success');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (!Array.isArray(importedTasks)) {
                    throw new Error('Invalid file format');
                }

                // Merge with existing tasks, giving new IDs to imported tasks
                const newTasks = importedTasks.map(task => ({
                    ...task,
                    id: Date.now() + Math.random() // Generate new unique ID
                }));

                this.tasks = [...this.tasks, ...newTasks];
                this.saveTasks();
                this.renderTasks();
                this.showMessage(`Imported ${newTasks.length} tasks successfully!`, 'success');
            } catch (error) {
                this.showMessage('Error importing tasks. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    showAnalytics() {
        const modal = document.getElementById('analyticsModal');
        if (!modal) {
            this.showMessage('Analytics modal not found!', 'error');
            return;
        }

        // Calculate analytics data
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        // Priority distribution
        const priorities = this.tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});

        // Category distribution
        const categories = this.tasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {});

        // Due date analysis
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const overdue = this.tasks.filter(t => t.date && t.date < today && !t.completed).length;
        const dueToday = this.tasks.filter(t => t.date === today && !t.completed).length;

        // Update modal content
        document.getElementById('taskOverview').innerHTML = `
            <div class="analytics-item"><span>Total Tasks:</span> <strong>${total}</strong></div>
            <div class="analytics-item"><span>Completed:</span> <strong>${completed}</strong></div>
            <div class="analytics-item"><span>Pending:</span> <strong>${pending}</strong></div>
            <div class="analytics-item"><span>Completion Rate:</span> <strong>${total > 0 ? Math.round((completed / total) * 100) : 0}%</strong></div>
        `;

        document.getElementById('priorityStats').innerHTML = Object.entries(priorities)
            .map(([priority, count]) => `
                <div class="analytics-item">
                    <span>${priority.charAt(0).toUpperCase() + priority.slice(1)}:</span> 
                    <strong>${count}</strong>
                </div>
            `).join('');

        document.getElementById('categoryStats').innerHTML = Object.entries(categories)
            .map(([category, count]) => `
                <div class="analytics-item">
                    <span>${category.charAt(0).toUpperCase() + category.slice(1)}:</span> 
                    <strong>${count}</strong>
                </div>
            `).join('');

        document.getElementById('dueDateStats').innerHTML = `
            <div class="analytics-item"><span>Overdue:</span> <strong class="overdue">${overdue}</strong></div>
            <div class="analytics-item"><span>Due Today:</span> <strong class="due-today">${dueToday}</strong></div>
            <div class="analytics-item"><span>No Due Date:</span> <strong>${this.tasks.filter(t => !t.date).length}</strong></div>
        `;

        modal.style.display = 'block';
    }
}

// Global functions for HTML onclick handlers
function fillDemoCredentials() {
    document.getElementById('loginEmail').value = 'demo@example.com';
    document.getElementById('loginPassword').value = 'password123';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Form').classList.add('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Chatbot functions
let chatExpanded = true;

function toggleChatbot() {
    const chatBody = document.getElementById('chatbotBody');
    const toggleIcon = document.getElementById('chatbotToggle');
    
    chatExpanded = !chatExpanded;
    
    if (chatExpanded) {
        chatBody.classList.remove('collapsed');
        toggleIcon.className = 'fas fa-chevron-up';
    } else {
        chatBody.classList.add('collapsed');
        toggleIcon.className = 'fas fa-chevron-down';
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    setTimeout(() => {
        const response = generateChatResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateChatResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('login') || msg.includes('sign in')) {
        return 'To login, use email: demo@example.com and password: password123. Or try Guest Mode!';
    }
    
    if (msg.includes('task') || msg.includes('todo')) {
        return 'You can add tasks with titles, descriptions, due dates, priorities, and categories. Use the form in the main app!';
    }
    
    if (msg.includes('help') || msg.includes('how')) {
        return 'I can help with login, creating tasks, and using app features. What specific help do you need?';
    }
    
    return 'Thanks for your message! I can help with login, tasks, and app features. What would you like to know?';
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new SimpleTodoApp();
    console.log('Simple Todo App initialized');
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.todoApp = new SimpleTodoApp();
}

// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const todoInput = document.getElementById('todo-input');
const subjectSelect = document.getElementById('subject-select');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const startTimerBtn = document.getElementById('start-timer-btn');
const pauseTimerBtn = document.getElementById('pause-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const timerDisplay = document.getElementById('timer');
const timerLabel = document.getElementById('timer-label');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const noteModal = document.getElementById('note-modal');
const closeModal = document.querySelector('.close-modal');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveNoteBtn = document.getElementById('save-note-btn');
const storageNotice = document.getElementById('storage-notice');
const closeNoticeBtn = document.getElementById('close-notice-btn');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

// App State
let todos = JSON.parse(localStorage.getItem('studysync_todos')) || [];
let notes = JSON.parse(localStorage.getItem('studysync_notes')) || [];
let currentFilter = 'all';
let timerInterval;
let isTimerRunning = false;
let isBreakTime = false;
let timeLeft = 25 * 60; // 25 minutes in seconds
let currentNoteId = null;

// Initialize the app
function init() {
    // Set theme from localStorage
    const savedTheme = localStorage.getItem('studysync_theme') || 'light';
    document.body.className = `${savedTheme}-mode`;
    updateThemeToggleButton(savedTheme);
    
    // Render todos and notes
    renderTodos();
    renderNotes();
    
    // Fetch daily quote
    fetchDailyQuote();
    
    // Show storage notice if not dismissed before
    const noticeShown = localStorage.getItem('studysync_notice_shown');
    if (!noticeShown) {
        storageNotice.style.display = 'flex';
    } else {
        storageNotice.style.display = 'none';
    }
}

// Theme Toggle
function updateThemeToggleButton(theme) {
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    }
}

themeToggleBtn.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    document.body.className = `${newTheme}-mode`;
    localStorage.setItem('studysync_theme', newTheme);
    updateThemeToggleButton(newTheme);
});

// Fetch Daily Quote
async function fetchDailyQuote() {
    try {
        // Check if we already fetched a quote today
        const savedQuote = JSON.parse(localStorage.getItem('studysync_daily_quote'));
        const today = new Date().toDateString();
        
        if (savedQuote && savedQuote.date === today) {
            // Use the saved quote if it's from today
            quoteText.textContent = `"${savedQuote.content}"`;
            quoteAuthor.textContent = `— ${savedQuote.author}`;
        } else {
            // Fetch a new quote
            const response = await fetch('https://api.quotable.io/random?tags=inspirational,education,wisdom');
            const data = await response.json();
            
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = `— ${data.author}`;
            
            // Save the quote with today's date
            localStorage.setItem('studysync_daily_quote', JSON.stringify({
                content: data.content,
                author: data.author,
                date: today
            }));
        }
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteText.textContent = '"The harder you work, the luckier you get."';
quoteAuthor.textContent = '— Gary Player';

quoteText.textContent = '"Success is the sum of small efforts, repeated day in and day out."';
quoteAuthor.textContent = '— Robert Collier';

quoteText.textContent = '"Don’t be afraid to give up the good to go for the great."';
quoteAuthor.textContent = '— John D. Rockefeller';

quoteText.textContent = '"If you’re not willing to risk the usual, you will have to settle for the ordinary."';
quoteAuthor.textContent = '— Jim Rohn';

quoteText.textContent = '"You miss 100% of the shots you don’t take."';
quoteAuthor.textContent = '— Wayne Gretzky';

quoteText.textContent = '"The only way to do great work is to love what you do."';
quoteAuthor.textContent = '— Steve Jobs';

quoteText.textContent = '"The best time to plant a tree was 20 years ago. The second best time is now."';
quoteAuthor.textContent = '— Chinese Proverb';

quoteText.textContent = '"The only limit to our realization of tomorrow is our doubts of today."';
quoteAuthor.textContent = '— Franklin D. Roosevelt';

quoteText.textContent = '"Hardships often prepare ordinary people for an extraordinary destiny."';
quoteAuthor.textContent = '— C.S. Lewis';

quoteText.textContent = '"Success usually comes to those who are too busy to be looking for it."';
quoteAuthor.textContent = '— Henry David Thoreau';

quoteText.textContent = '"The future depends on what you do today."';
quoteAuthor.textContent = '— Mahatma Gandhi';

quoteText.textContent = '"It does not matter how slowly you go as long as you do not stop."';
quoteAuthor.textContent = '— Confucius';

quoteText.textContent = '"Don’t watch the clock; do what it does. Keep going."';
quoteAuthor.textContent = '— Sam Levenson';

quoteText.textContent = '"If you can dream it, you can do it."';
quoteAuthor.textContent = '— Walt Disney';

quoteText.textContent = '"Do one thing every day that scares you."';
quoteAuthor.textContent = '— Eleanor Roosevelt';

quoteText.textContent = '"In the middle of every difficulty lies opportunity."';
quoteAuthor.textContent = '— Albert Einstein';

quoteText.textContent = '"You are never too old to set another goal or to dream a new dream."';
quoteAuthor.textContent = '— C.S. Lewis';

quoteText.textContent = '"Success is not final, failure is not fatal: It is the courage to continue that counts."';
quoteAuthor.textContent = '— Winston Churchill';

quoteText.textContent = '"It’s not whether you get knocked down, it’s whether you get up."';
quoteAuthor.textContent = '— Vince Lombardi';

quoteText.textContent = '"The way to get started is to quit talking and begin doing."';
quoteAuthor.textContent = '— Walt Disney';

    }
}

// Todo List Functions
function addTodo() {
    const todoText = todoInput.value.trim();
    const subject = subjectSelect.value;
    
    if (todoText && subject) {
        const newTodo = {
            id: Date.now(),
            text: todoText,
            subject: subject,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        
        // Reset form
        todoInput.value = '';
        subjectSelect.value = '';
        todoInput.focus();
    } else {
        alert('Please enter a task and select a subject');
    }
}

function toggleTodoComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('studysync_todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = currentFilter === 'all' 
        ? todos 
        : todos.filter(todo => todo.subject === currentFilter);
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks found. Add some tasks to get started!</li>';
        return;
    }
    
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'todo-completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoComplete(todo.id));
        
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        const todoSubject = document.createElement('span');
        todoSubject.className = 'todo-subject';
        todoSubject.setAttribute('data-subject', todo.subject);
        todoSubject.textContent = todo.subject;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(todoSubject);
        todoItem.appendChild(deleteBtn);
        
        todoList.appendChild(todoItem);
    });
}

// Filter Todos
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
    });
});

// Pomodoro Timer Functions
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                
                if (isBreakTime) {
                    // Switch to focus time
                    isBreakTime = false;
                    timeLeft = 25 * 60;
                    timerLabel.textContent = 'FOCUS TIME';
                    document.title = 'StudySync - Focus Time';
                    alert('Break time is over! Time to focus again.');
                } else {
                    // Switch to break time
                    isBreakTime = true;
                    timeLeft = 5 * 60;
                    timerLabel.textContent = 'BREAK TIME';
                    document.title = 'StudySync - Break Time';
                    alert('Good job! Take a 5-minute break.');
                }
                
                updateTimerDisplay();
                startTimerBtn.disabled = false;
                pauseTimerBtn.disabled = true;
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isBreakTime = false;
    timeLeft = 25 * 60;
    timerLabel.textContent = 'FOCUS TIME';
    document.title = 'StudySync - Smart Study Planner';
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

// Notes Functions
function openNoteModal(note = null) {
    if (note) {
        // Edit existing note
        noteTitle.value = note.title;
        noteContent.value = note.content;
        currentNoteId = note.id;
    } else {
        // Create new note
        noteTitle.value = '';
        noteContent.value = '';
        currentNoteId = null;
    }
    
    noteModal.style.display = 'flex';
    noteTitle.focus();
}

function closeNoteModal() {
    noteModal.style.display = 'none';
}

function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (title && content) {
        if (currentNoteId) {
            // Update existing note
            notes = notes.map(note => {
                if (note.id === currentNoteId) {
                    return {
                        ...note,
                        title,
                        content,
                        updatedAt: new Date().toISOString()
                    };
                }
                return note;
            });
        } else {
            // Create new note
            const newNote = {
                id: Date.now(),
                title,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            notes.push(newNote);
        }
        
        saveNotes();
        renderNotes();
        closeNoteModal();
    } else {
        alert('Please enter both title and content for your note');
    }
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
    }
}

function saveNotes() {
    localStorage.setItem('studysync_notes', JSON.stringify(notes));
}

function renderNotes() {
    notesContainer.innerHTML = '';
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="empty-state">No notes yet. Click "New Note" to create one!</div>';
        return;
    }
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.addEventListener('click', (e) => {
            // Don't open modal if delete button was clicked
            if (!e.target.closest('.note-delete')) {
                openNoteModal(note);
            }
        });
        
        const noteHeader = document.createElement('h3');
        noteHeader.className = 'note-title';
        noteHeader.textContent = note.title;
        
        const noteBody = document.createElement('div');
        noteBody.className = 'note-content';
        noteBody.textContent = note.content;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'note-delete';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });
        
        const noteDate = document.createElement('div');
        noteDate.className = 'note-date';
        const date = new Date(note.updatedAt);
        noteDate.textContent = date.toLocaleDateString();
        
        noteCard.appendChild(noteHeader);
        noteCard.appendChild(noteBody);
        noteCard.appendChild(deleteBtn);
        noteCard.appendChild(noteDate);
        
        notesContainer.appendChild(noteCard);
    });
}

// Event Listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

addNoteBtn.addEventListener('click', () => openNoteModal());
closeModal.addEventListener('click', closeNoteModal);
saveNoteBtn.addEventListener('click', saveNote);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        closeNoteModal();
    }
});

// Close storage notice
closeNoticeBtn.addEventListener('click', () => {
    storageNotice.style.display = 'none';
    localStorage.setItem('studysync_notice_shown', 'true');
});

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

// Update document title when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isTimerRunning) {
        document.title = isBreakTime ? '⏰ Break Time' : '⏰ Focus Time';
    } else {
        document.title = 'StudySync - Smart Study Planner';
    }
});
// Add these to DOM Elements section
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const examNameInput = document.getElementById('exam-name');
const examDateInput = document.getElementById('exam-date');
const setExamBtn = document.getElementById('set-exam-btn');
const countdownDays = document.getElementById('countdown-days');
const countdownLabel = document.getElementById('countdown-label');

// Add to App State
let examData = JSON.parse(localStorage.getItem('studysync_exam')) || null;

// Add to init function
updateProgress();
if (examData) {
    loadExamCountdown();
    document.querySelector('.tab-btn[data-tab="countdown"]').click();
}

// Add these new functions
function updateProgress() {
    if (todos.length === 0) {
        progressFill.style.width = '0%';
        progressText.textContent = '0% Complete';
        return;
    }
    
    const completed = todos.filter(todo => todo.completed).length;
    const percentage = Math.round((completed / todos.length) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% Complete (${completed}/${todos.length} tasks)`;
}

function loadExamCountdown() {
    if (examData) {
        examNameInput.value = examData.name;
        examDateInput.value = examData.date;
        updateCountdown();
    }
}

function updateCountdown() {
    if (!examData) return;
    
    const examDate = new Date(examData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        countdownDays.textContent = diffDays;
        countdownLabel.textContent = `Days until ${examData.name}`;
    } else if (diffDays === 0) {
        countdownDays.textContent = '0';
        countdownLabel.textContent = `${examData.name} is today!`;
    } else {
        countdownDays.textContent = '0';
        countdownLabel.textContent = `${examData.name} has passed`;
    }
}

// Add to saveTodos function (at the end)
updateProgress();

// Add tab switching functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabId = btn.getAttribute('data-tab');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Exam countdown functionality
setExamBtn.addEventListener('click', () => {
    const name = examNameInput.value.trim();
    const date = examDateInput.value;
    
    if (name && date) {
        examData = {
            name,
            date
        };
        localStorage.setItem('studysync_exam', JSON.stringify(examData));
        updateCountdown();
        alert('Exam countdown set successfully!');
    } else {
        alert('Please enter both exam name and date');
    }
});

// Update countdown daily
setInterval(updateCountdown, 1000 * 60 * 60); // Check every hour
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
function generateText(system, content) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            // يمكنك تفعيل هذا إذا أردت تعليمة للنظام
            // { role: "system", content: system },
            { role: "user", content }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        resolve(response.data.choices[0].message.content);
      })
      .catch((err) => reject(err));
  });
}

sendBtn.addEventListener('click', async () => {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    appendMessage("user", userMsg);
    chatInput.value = '';

    appendMessage("bot", "⏳ جارٍ التحميل...");

    try {
        const botReply = await generateText("", userMsg); // "" يمكن استبدالها بتعليمات للبوت إذا أردت
        chatMessages.lastChild.remove(); // إزالة "جارٍ التحميل..."
        appendMessage("bot", botReply);
    } catch (err) {
        chatMessages.lastChild.remove();
        appendMessage("bot", "❌ فشل الاتصال بـ OpenRouter API.");
        console.error(err);
    }
});

function appendMessage(sender, text) {
    const message = document.createElement('div');
    message.className = `chat-message ${sender}`;
    message.textContent = (sender === "user" ? "👤 " : "🤖 ") + text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function generateText(system, content) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            // يمكنك تفعيل هذا إذا أردت تعليمة للنظام
            // { role: "system", content: system },
            { role: "user", content }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        resolve(response.data.choices[0].message.content);
      })
      .catch((err) => reject(err));
  });
}



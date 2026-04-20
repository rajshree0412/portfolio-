// ========================================
// DOCUMENT READY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Load feedback from local storage on page load
    displayFeedback();

    // Form Submission Handler
    const form = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMsg = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission
        
        // 1. Basic Validation
        let isValid = true;
        
        // Validate Name - should not be empty
        if (nameInput.value.trim() === '') {
            setError('nameError', '⚠️ Name is required');
            isValid = false;
        } else {
            clearError('nameError');
        }

        // Validate Email - should be valid format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            setError('emailError', '⚠️ Please enter a valid email');
            isValid = false;
        } else {
            clearError('emailError');
        }

        // If validation fails, stop here
        if (!isValid) return;

        // 2. Create Feedback Object
        const feedbackData = {
            id: Date.now(), // Unique ID
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };

        // 3. Save to Local Storage
        saveFeedback(feedbackData);

        // 4. DOM Manipulation - Show Success Message
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully!';
        
        // Reset form
        form.reset();

        // Reload feedback list
        displayFeedback();

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMsg.innerHTML = '';
        }, 5000);
    });
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Set error message
function setError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Clear error message
function clearError(id) {
    const errorElement = document.getElementById(id);
    errorElement.style.display = 'none';
}

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================

// Save feedback to local storage
function saveFeedback(data) {
    let feedbacks = JSON.parse(localStorage.getItem('anushkaFeedbacks')) || [];
    feedbacks.unshift(data); // Add new message at the beginning
    localStorage.setItem('anushkaFeedbacks', JSON.stringify(feedbacks));
}

// Display all feedback from local storage
function displayFeedback() {
    const feedbackList = document.getElementById('feedbackList');
    const feedbacks = JSON.parse(localStorage.getItem('anushkaFeedbacks')) || [];

    if (feedbacks.length === 0) {
        feedbackList.innerHTML = '<p class="no-msg">No messages yet. Be the first!</p>';
        return;
    }

    feedbackList.innerHTML = feedbacks.map(feedback => `
        <div class="feedback-item">
            <div class="feedback-header">
                <h4><i class="fas fa-user"></i> ${feedback.name}</h4>
                <span class="feedback-date">${feedback.date}</span>
            </div>
            <p class="feedback-email">${feedback.email}</p>
            <p class="feedback-message">${feedback.message}</p>
            <button class="delete-btn" onclick="deleteFeedback(${feedback.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Delete single feedback
function deleteFeedback(id) {
    let feedbacks = JSON.parse(localStorage.getItem('anushkaFeedbacks')) || [];
    feedbacks = feedbacks.filter(feedback => feedback.id !== id);
    localStorage.setItem('anushkaFeedbacks', JSON.stringify(feedbacks));
    displayFeedback();
}

// Clear all feedback
function clearFeedback() {
    if(confirm('Are you sure you want to clear all messages?')) {
        localStorage.removeItem('anushkaFeedbacks');
        displayFeedback();
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

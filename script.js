
// Store registered users in memory
let registeredUsers = {
    'player': 'casino123',
    'admin': 'admin123',
    'guest': 'guest123'
};

// Modal functions
function openModal(type) {
    const modal = document.getElementById('authModal');
    modal.style.display = 'block';
    
    if (type === 'login') {
        switchToLogin();
    } else if (type === 'register') {
        switchToRegister();
    }
}

// --- Toast system (non-blocking notifications) ---
function createToastContainer() {
    if (document.getElementById('toast-container')) return;
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.style.position = 'fixed';
    c.style.right = '20px';
    c.style.top = '20px';
    c.style.zIndex = 2000;
    document.body.appendChild(c);
}

function showToast(message, type = 'info', timeout = 3000) {
    createToastContainer();
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = message;
    t.style.background = type === 'error' ? '#ff6b6b' : (type === 'success' ? '#2ecc71' : '#333');
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.marginTop = '8px';
    t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35)';
    t.style.opacity = '0';
    t.style.transform = 'translateY(-6px)';
    t.style.transition = 'all 240ms ease';
    container.appendChild(t);
    requestAnimationFrame(() => {
        t.style.opacity = '1';
        t.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(-6px)';
        setTimeout(() => t.remove(), 260);
    }, timeout);
}


function closeModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    clearForms();
}

function switchToLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    clearForms();
}

function switchToRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    clearForms();
}

function clearForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').classList.remove('show');
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerSuccess').classList.remove('show');
    document.getElementById('registerSuccess').textContent = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (modal && event.target === modal) {
        closeModal();
    }
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameEl = document.getElementById('loginUsername');
        const passwordEl = document.getElementById('loginPassword');
        const errorMsg = document.getElementById('loginError');
        const username = usernameEl ? usernameEl.value : '';
        const password = passwordEl ? passwordEl.value : '';

        if (registeredUsers[username] && registeredUsers[username] === password) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);
            if (errorMsg) {
                errorMsg.classList.remove('show');
                errorMsg.textContent = '';
            }

            closeModal();
            // Inform the user and then redirect to the home page
            showToast('Login successful! Welcome to Casino À La Stephen!', 'success');
            updateUIForLoggedIn();
            // Redirect to index.html
            window.location.href = 'index.html';
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Invalid username or password!';
                errorMsg.classList.add('show');
            }
        }
    });
}

// Register form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameEl = document.getElementById('regUsername');
        const emailEl = document.getElementById('regEmail');
        const passwordEl = document.getElementById('regPassword');
        const confirmPasswordEl = document.getElementById('regConfirmPassword');
        const errorMsg = document.getElementById('registerError');
        const successMsg = document.getElementById('registerSuccess');

        const username = usernameEl ? usernameEl.value : '';
        const email = emailEl ? emailEl.value : '';
        const password = passwordEl ? passwordEl.value : '';
        const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';

        if (errorMsg) errorMsg.classList.remove('show');
        if (successMsg) successMsg.classList.remove('show');

        // Validation
        if (registeredUsers[username]) {
            if (errorMsg) {
                errorMsg.textContent = 'Username already exists!';
                errorMsg.classList.add('show');
            }
            return;
        }

        if (password.length < 6) {
            if (errorMsg) {
                errorMsg.textContent = 'Password must be at least 6 characters!';
                errorMsg.classList.add('show');
            }
            return;
        }

        if (password !== confirmPassword) {
            if (errorMsg) {
                errorMsg.textContent = 'Passwords do not match!';
                errorMsg.classList.add('show');
            }
            return;
        }

        // Register user (in-memory)
        registeredUsers[username] = password;
        if (successMsg) {
            successMsg.textContent = 'Registration successful! You can now login.';
            successMsg.classList.add('show');
        }

        // Clear form and switch to login after 2 seconds
        setTimeout(() => {
            switchToLogin();
        }, 2000);
    });
}

// Check login for games
function checkLogin() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        showToast('Please login to play games!', 'error');
        openModal('login');
    } else {
        // If on login page, navigate to index; otherwise proceed to load game
        if (window.location.pathname.split('/').pop() === 'login.html') {
            window.location.href = 'index.html';
        } else {
            showToast('Loading game...', 'info');
        }
    }
}

// Update UI when logged in
function updateUIForLoggedIn() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        const username = sessionStorage.getItem('username');
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = username;
            loginBtn.onclick = function() {
                if (confirm('Do you want to logout?')) {
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('username');
                    window.location.href = 'login.html';
                }
            };
        }
    }
}
// Helper for safe event attachment
function safeAddListener(selector, event, handler) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener(event, handler);
}

// Run on DOM ready: update UI and enforce page-level redirects
window.addEventListener('DOMContentLoaded', function() {
    updateUIForLoggedIn();

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const current = window.location.pathname.split('/').pop();

    // If on index page and not logged in, send user to login
    if ((current === 'index.html' || current === '') && !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // If on login page and already logged in, go to index
    if (current === 'login.html' && isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Defensive listeners for optional elements
    safeAddListener('.btn-deposit', 'click', function() { showToast('Deposit feature - Coming soon!', 'info'); });
    safeAddListener('.btn-withdraw', 'click', function() { showToast('Withdraw feature - Coming soon!', 'info'); });
    safeAddListener('.notification-icon', 'click', function() { showToast('You have no new notifications.', 'info'); });
    safeAddListener('.play-now-btn', 'click', function() { window.location.href = 'game.html'; });

    

// Defensive single-element handlers (already added above via safeAddListener); the following attach only if elements exist
const depositBtn = document.querySelector('.btn-deposit');
if (depositBtn) depositBtn.addEventListener('click', () => showToast('Deposit feature - Coming soon!', 'info'));

const withdrawBtn = document.querySelector('.btn-withdraw');
if (withdrawBtn) withdrawBtn.addEventListener('click', () => showToast('Withdraw feature - Coming soon!', 'info'));

const notifIcon = document.querySelector('.notification-icon');
if (notifIcon) notifIcon.addEventListener('click', () => showToast('You have no new notifications.', 'info'));

// Sidebar navigation: clicking still switches active class but will no longer show blocking alerts
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function(e) {
        if (!this.classList.contains('active')) {
            // let the link navigate; only adjust classes when navigation prevented
            // If link has href='#' prevent and show message
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript')) {
                e.preventDefault();
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const text = this.querySelector('.text') ? this.querySelector('.text').textContent : '';
                if (text === 'My Games') showToast('My Games page - Coming soon!', 'info');
                if (text === 'Profile') showToast('Profile page - Coming soon!', 'info');
            }
        }
    });
});

// Logout functionality (can be added to a menu later)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        showToast('You have been logged out.', 'info');
        window.location.href = 'login.html';
    }
}

// expose on window for inline onclick handlers
window.logout = logout;
// Simple demo script handlers (defensive)
// Attach listeners to both .logout-btn and .btn-logout (different pages may use different names)
['.logout-btn', '.btn-logout'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});

const editBtn = document.querySelector('.edit-btn');
if (editBtn) editBtn.addEventListener('click', () => showToast('Redirecting to Edit Profile...', 'info'));
});
// Check if user is logged in
window.onload = function() {
    const current = window.location.pathname.split('/').pop();
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    // If user is not logged in and is not already on the login page, send them to login
    if (!isLoggedIn && current !== 'login.html') {
        window.location.href = 'login.html';
    }
};

// Games modal: use local PNG assets and provide open/close, backdrop + ESC handling
const gameMap = {
    'super-ace': { img: 'images/SA.png', label: 'Super Ace' },
    'gates-olympus': { img: 'images/GO.png', label: 'Gates of Olympus 1000' },
    'color-game': { img: 'images/CG.png', label: 'Color Game' },
    'starlight-princess': { img: 'images/SP.png', label: 'Starlight Princess' },
    'pinata-wins': { img: 'images/PW.png', label: 'Pinata Wins' },
    'sweet-bonanza': { img: 'images/SB.png', label: 'Sweet Bonanza' }
};

function playGame(slug) {
    const modal = document.getElementById('gameModal');
    const modalImage = document.getElementById('gameImage');
    const info = gameMap[slug];
    if (!info) return console.warn('Unknown game:', slug);

    if (modalImage) {
        modalImage.src = info.img;
        modalImage.alt = info.label;
    }

    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modal.setAttribute('tabindex', '-1');
        modal.focus();
    }
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    const modalImage = document.getElementById('gameImage');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (modalImage) modalImage.src = '';
}

// Backdrop click for game modal (attach only once)
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeGameModal();
        });
    }

    // ESC to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (modal && modal.style.display === 'block') closeGameModal();
        }
    });
});

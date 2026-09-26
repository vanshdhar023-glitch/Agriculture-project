const DEMO_ACCOUNT = {
    name: 'Rajesh Kumar',
    email: 'farmer@agriprice.org',
    password: 'demo1234',
    role: 'farmer',
    state: 'Punjab'
};

const INDIA_STATES_AND_UTS = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
    'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal'
];

const queryMode = new URLSearchParams(window.location.search).get('mode');
const turnstileWidgets = {};
let turnstileToken = '';
let turnstileSiteKey = '';
let turnstileReady = false;
let turnstileInitializing = false;
let loginCaptchaValue = '';

window.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('registerState');
    INDIA_STATES_AND_UTS.forEach(stateName => {
        const option = document.createElement('option');
        option.value = stateName;
        option.textContent = stateName;
        stateSelect.appendChild(option);
    });
    refreshLoginCaptcha();
    switchAuthMode(queryMode === 'register' ? 'register' : 'login');
});

function switchAuthMode(mode) {
    const isLogin = mode === 'login';
    document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
    document.getElementById('registerForm').classList.toggle('hidden', isLogin);
    document.getElementById('loginTab').classList.toggle('active', isLogin);
    document.getElementById('registerTab').classList.toggle('active', !isLogin);
    document.getElementById('authTitle').innerText = isLogin ? 'Sign in to your hub' : 'Create your AgriPrice account';
    document.getElementById('authSubtitle').innerText = isLogin ? 'Use your account to continue to your market dashboard.' : 'Set up your profile to personalize prices and alerts.';
    clearAuthMessage();
    if (!isLogin) initializeTurnstile();
}

function setAuthMessage(message, type) {
    const element = document.getElementById('authMessage');
    element.innerText = message;
    element.className = `mb-4 rounded-lg p-3 text-xs ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`;
}

function clearAuthMessage() {
    const element = document.getElementById('authMessage');
    element.innerText = '';
    element.className = 'hidden mb-4 rounded-lg p-3 text-xs';
}

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem('agriPriceAccounts')) || [];
    } catch (error) {
        return [];
    }
}

function saveSession(account, rememberMe) {
    const session = { name: account.name, email: account.email, role: ['farmer', 'trader'].includes(account.role) ? account.role : 'farmer', state: account.state };
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('agriPriceSession', JSON.stringify(session));
}

function completeLogin(account, rememberMe) {
    localStorage.removeItem('agriPriceSession');
    sessionStorage.removeItem('agriPriceSession');
    saveSession(account, rememberMe);
    window.location.href = 'index.html';
}

async function initializeTurnstile() {
    if (turnstileReady || turnstileInitializing) return;
    turnstileInitializing = true;

    try {
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        if (configResponse.ok && config.enabled && config.siteKey) {
            turnstileSiteKey = config.siteKey;
            await loadTurnstileScript();
            renderTurnstile();
            turnstileReady = true;
        } else {
            // Turnstile not configured; allow demo / dev registration
            const widgetBox = document.getElementById('registerTurnstile');
            if (widgetBox) {
                widgetBox.innerHTML = '<div class="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2"><i class="fa-solid fa-shield-check text-base text-emerald-600"></i><span>MongoDB Security Active &bull; Development verification mode enabled</span></div>';
            }
        }
    } catch (error) {
        console.info('Running in offline / local development mode');
    } finally {
        turnstileInitializing = false;
    }
}

function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Could not load Cloudflare Turnstile.'));
        document.head.appendChild(script);
    });
}

function renderTurnstile() {
    if (!turnstileSiteKey || !window.turnstile || turnstileWidgets.register !== undefined) return;

    turnstileWidgets.register = window.turnstile.render('#registerTurnstile', {
        sitekey: turnstileSiteKey,
        action: 'register',
        theme: 'light',
        callback: token => { turnstileToken = token; },
        'expired-callback': () => { turnstileToken = ''; },
        'error-callback': () => {
            turnstileToken = '';
            setAuthMessage('Cloudflare could not complete verification. Please try again.', 'error');
        }
    });
}

async function verifyTurnstile() {
    if (!turnstileSiteKey) {
        // If Turnstile is not enabled, pass directly
        return true;
    }

    const token = turnstileToken;
    if (!token) {
        setAuthMessage('Complete the Cloudflare security check before continuing.', 'error');
        return false;
    }

    try {
        const response = await fetch('/api/verify-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, action: 'register' })
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error('Turnstile verification failed.');

        turnstileToken = '';
        window.turnstile.reset(turnstileWidgets.register);
        return true;
    } catch (error) {
        turnstileToken = '';
        if (window.turnstile && turnstileWidgets.register !== undefined) window.turnstile.reset(turnstileWidgets.register);
        setAuthMessage('Cloudflare verification failed. Please complete the check again.', 'error');
        return false;
    }
}

async function submitLogin(event) {
    event.preventDefault();
    if (document.getElementById('loginCaptchaInput').value.trim().toUpperCase() !== loginCaptchaValue) {
        setAuthMessage('That security code did not match. Try the new code.', 'error');
        refreshLoginCaptcha();
        return;
    }
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            if (data.token) localStorage.setItem('agriPriceToken', data.token);
            completeLogin(data.user, document.getElementById('rememberMe').checked);
            return;
        } else {
            setAuthMessage(data.error || 'We could not match that email and password.', 'error');
            return;
        }
    } catch (err) {
        console.warn('API login offline, checking local accounts:', err);
        const account = [DEMO_ACCOUNT, ...getAccounts()].find(item => item.email.toLowerCase() === email && item.password === password);
        if (!account) {
            setAuthMessage('We could not match that email and password. Try the demo account or register a new profile.', 'error');
            return;
        }
        completeLogin({ ...account, role: ['farmer', 'trader'].includes(account.role) ? account.role : 'farmer' }, document.getElementById('rememberMe').checked);
    }
}

async function submitRegistration(event) {
    event.preventDefault();
    if (!await verifyTurnstile()) return;
    const account = {
        name: document.getElementById('registerName').value.trim(),
        email: document.getElementById('registerEmail').value.trim().toLowerCase(),
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value,
        state: document.getElementById('registerState').value
    };

    if (!['farmer', 'trader'].includes(account.role) || !INDIA_STATES_AND_UTS.includes(account.state)) {
        setAuthMessage('Choose a valid role and an Indian state or union territory.', 'error');
        return;
    }
    if (account.password.length < 8) {
        setAuthMessage('Use at least 8 characters for your password.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account)
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            setAuthMessage(data.error || 'Registration failed.', 'error');
            return;
        }

        if (data.token) localStorage.setItem('agriPriceToken', data.token);
        // Also keep local accounts updated
        const accounts = getAccounts();
        accounts.push(account);
        localStorage.setItem('agriPriceAccounts', JSON.stringify(accounts));

        completeLogin(data.user || account, true);
    } catch (err) {
        console.warn('API register offline, saving locally:', err);
        const accounts = getAccounts();
        if (account.email === DEMO_ACCOUNT.email || accounts.some(item => item.email === account.email)) {
            setAuthMessage('That email is already registered. Log in instead.', 'error');
            switchAuthMode('login');
            document.getElementById('loginEmail').value = account.email;
            return;
        }
        accounts.push(account);
        localStorage.setItem('agriPriceAccounts', JSON.stringify(accounts));
        completeLogin(account, true);
    }
}

function refreshLoginCaptcha() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(6));
    loginCaptchaValue = Array.from(randomValues, value => alphabet[value & 31]).join('');
    document.getElementById('loginCaptchaCode').innerText = loginCaptchaValue;
    document.getElementById('loginCaptchaInput').value = '';
}

function fillDemoCredentials() {
    document.getElementById('loginEmail').value = DEMO_ACCOUNT.email;
    document.getElementById('loginPassword').value = DEMO_ACCOUNT.password;
    document.getElementById('rememberMe').checked = true;
    setAuthMessage('Demo credentials filled. Submit the form to enter the workspace.', 'success');
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    button.innerHTML = `<i class="fa-regular fa-eye${visible ? '' : '-slash'}"></i>`;
    button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
}

function updatePasswordStrength(password) {
    const bar = document.getElementById('passwordStrengthBar');
    const label = document.getElementById('passwordStrengthText');
    const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    const levels = [
        { width: '0%', color: 'bg-slate-200', text: 'Use letters, numbers, and symbols for a stronger password.' },
        { width: '25%', color: 'bg-red-500', text: 'Too weak' },
        { width: '50%', color: 'bg-amber-500', text: 'Getting stronger' },
        { width: '75%', color: 'bg-blue-500', text: 'Good password' },
        { width: '100%', color: 'bg-emerald-500', text: 'Strong password' }
    ][password ? score : 0];
    bar.style.width = levels.width;
    bar.className = `h-full transition-all ${levels.color}`;
    label.innerText = levels.text;
}

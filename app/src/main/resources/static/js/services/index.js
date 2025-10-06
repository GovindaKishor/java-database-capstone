// --- 1. Import Required Modules (Placeholders) ---
// NOTE: These imports assume configuration and modal functions are set up in sibling folders.
// import { openModal } from '../components/modals.js';
// import { API_BASE_URL } from '../config/config.js';

// Expose these as global functions for the modal forms to call them via onclick=""
window.adminLoginHandler = adminLoginHandler;
window.doctorLoginHandler = doctorLoginHandler;

// Mock imports for immediate functionality checks
const API_BASE_URL = 'http://localhost:8080/api';
// Assuming openModal is defined elsewhere or globally exposed.
// We'll define a simple placeholder to prevent errors.
const openModal = (type) => { console.log(`Opening modal for: ${type}`); };


// --- 2. Define API Endpoints ---
const ADMIN_API = API_BASE_URL + '/admin/login'; // Changed from /admin to /admin/login for clarity
const DOCTOR_API = API_BASE_URL + '/doctor/login';

/**
 * Helper function to handle the API fetch operation with error handling.
 * @param {string} url - The API endpoint URL.
 * @param {object} data - The credentials object to send in the request body.
 * @returns {Promise<object>} The JSON response body.
 */
async function fetchLogin(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            // Throw an error with the server's message if the response status is not 2xx
            throw new Error(json.message || 'Invalid credentials or login failed.');
        }

        return json;
        
    } catch (error) {
        console.error("Login attempt error:", error.message);
        // IMPORTANT: Use custom logging instead of alert()
        alert("Login Failed: " + error.message); 
        throw error; // Re-throw the error to be caught by the handler functions
    }
}

// --- 3. Implement Admin Login Handler ---
/**
 * Handles the submission of the Admin login form.
 * It authenticates the user and stores the token upon success.
 */
async function adminLoginHandler() {
    // 1. Read input values from the modal form (assuming form IDs are standard)
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');

    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const admin = { username, password };

    try {
        const responseData = await fetchLogin(ADMIN_API, admin);

        // 2. Handle Success
        const token = responseData.token; // Assuming the API returns a token field
        localStorage.setItem("token", token);
        
        // Assuming selectRole is available globally (defined in render.js)
        if (typeof selectRole === 'function') {
            selectRole("admin");
        } else {
            // If selectRole isn't loaded, set role and manually redirect
            localStorage.setItem("userRole", "admin");
            window.location.href = "/admin/adminDashboard.html";
        }
        
    } catch (error) {
        // Error already handled and logged in fetchLogin
    }
}


// --- 4. Implement Doctor Login Handler ---
/**
 * Handles the submission of the Doctor login form.
 * It authenticates the user and stores the token upon success.
 */
async function doctorLoginHandler() {
    // 1. Read input values from the modal form (assuming form IDs are standard)
    const emailInput = document.getElementById('doctorEmail');
    const passwordInput = document.getElementById('doctorPassword');
    
    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const doctor = { email, password };

    try {
        const responseData = await fetchLogin(DOCTOR_API, doctor);
        
        // 2. Handle Success
        const token = responseData.token; // Assuming the API returns a token field
        localStorage.setItem("token", token);
        
        // Assuming selectRole is available globally (defined in render.js)
        if (typeof selectRole === 'function') {
            selectRole("doctor");
        } else {
            // If selectRole isn't loaded, set role and manually redirect
            localStorage.setItem("userRole", "doctor");
            window.location.href = "/doctor/doctorDashboard.html";
        }

    } catch (error) {
        // Error already handled and logged in fetchLogin
    }
}


// --- 5. Setup Button Event Listeners ---
/**
 * Attaches event listeners to the role selection buttons on the index page
 * to trigger the appropriate login modals.
 */
window.onload = function () {
    const adminBtn = document.getElementById('adminLogin');
    const doctorBtn = document.getElementById('doctorLogin');
    const patientBtn = document.getElementById('patientLogin');

    // Admin button opens the Admin login modal
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            openModal('adminLogin');
            // Prevent selectRole('admin') from running if it's set inline, 
            // though the better fix is removing inline onclick=""
            if (adminBtn.getAttribute('onclick')) {
                adminBtn.removeAttribute('onclick');
            }
        });
    }
    
    // Doctor button opens the Doctor login modal
    if (doctorBtn) {
        doctorBtn.addEventListener('click', () => {
            openModal('doctorLogin');
            if (doctorBtn.getAttribute('onclick')) {
                doctorBtn.removeAttribute('onclick');
            }
        });
    }

    // Patient button opens the Patient selection modal (login/signup)
    // We can assume 'patient' role selection opens a general auth modal
    if (patientBtn) {
        patientBtn.addEventListener('click', () => {
            openModal('patientAuth');
            if (patientBtn.getAttribute('onclick')) {
                patientBtn.removeAttribute('onclick');
            }
        });
    }
};

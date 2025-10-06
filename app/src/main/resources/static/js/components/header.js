// Expose logout functions globally so they can be called from inline onclick attributes in the rendered HTML
window.logout = logout;
window.logoutPatient = logoutPatient;

/**
 * Logs out the current Admin or Doctor user by clearing localStorage and redirecting to the homepage.
 * This function is exposed globally to be called from the header HTML.
 */
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    // Redirect to the homepage/role selection page
    window.location.href = "/";
}

/**
 * Logs out a 'loggedPatient' user. Clears the token but sets the role back to 'patient' 
 * to allow them to see the Login/Sign Up buttons on the dashboard again.
 * This function is exposed globally.
 */
function logoutPatient() {
    localStorage.removeItem("token");
    localStorage.setItem("userRole", "patient");
    // Redirect back to the patient dashboard, which will re-render the header to show Login/Sign Up
    window.location.href = "/pages/patientDashboard.html";
}

/**
 * Attaches event listeners to dynamically created header elements (like Add Doctor button).
 * This ensures dynamic content is interactive after injection.
 */
function attachHeaderButtonListeners() {
    // Find the button for adding a doctor and ensure it opens the modal
    const addDocBtn = document.getElementById("addDocBtn");
    if (addDocBtn) {
        // The openModal function is assumed to be defined in another utility file (e.g., modals.js or util.js)
        addDocBtn.addEventListener("click", () => {
            if (typeof openModal === 'function') {
                openModal('addDoctor');
            } else {
                console.error("openModal function is not defined.");
            }
        });
    }
}

/**
 * Renders the appropriate header content based on the user role and login state.
 */
export function renderHeader() {
    const headerDiv = document.getElementById("header");
    let headerContent = "";
    
    if (!headerDiv) {
        // If the placeholder div doesn't exist, we can't render the header.
        return;
    }

    // 1. Check for homepage: Clear session data if on the root path
    if (window.location.pathname.endsWith("/")) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
    }

    // Retrieve current role and token
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // 2. Session Validation: Check if a logged-in role exists without a token
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
      
      // IMPORTANT: Use console.error instead of alert()
      console.error("Session expired or invalid login. Redirecting to home.");
      
      window.location.href = "/";
      return;
    }

    // Base Header Structure (Logo/Title Area)
    headerContent = `
        <div class="logo-area">
            <a href="/" class="header-link">
                <img src="/assets/images/logo.png" alt="Smart Clinic Logo" class="logo">
                <h1 class="text-xl font-bold">Smart Clinic</h1>
            </a>
        </div>
        <nav class="nav-links flex items-center space-x-4">
    `;

    // 3. Conditional Navigation Links
    if (role === "admin") {
      // Admin: Add Doctor button (opens modal) and Logout
      headerContent += `
        <button id="addDocBtn" class="adminBtn button text-white bg-blue-600 hover:bg-blue-700 transition duration-150">Add Doctor</button>
        <button class="button logout-btn bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150" onclick="logout()">Logout</button>
      `;
    } else if (role === "doctor") {
      // Doctor: Home (Dashboard) and Logout
      headerContent += `
        <a href="/doctor/doctorDashboard.html" class="button nav-button text-white bg-blue-600 hover:bg-blue-700 transition duration-150">Home</a>
        <button class="button logout-btn bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150" onclick="logout()">Logout</button>
      `;
    } else if (role === "loggedPatient") {
      // Logged Patient: Home (Dashboard), Appointments, and Logout
      headerContent += `
        <a href="/pages/patientDashboard.html" class="button nav-button text-white bg-blue-600 hover:bg-blue-700 transition duration-150">Home</a>
        <a href="/pages/appointments.html" class="button nav-button bg-green-500 text-white hover:bg-green-600 transition duration-150">Appointments</a>
        <button class="button logout-btn bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150" onclick="logoutPatient()">Logout</button>
      `;
    } else { // Covers role === "patient" or no role set (default index page)
      // Default/Unauthenticated: Login and Sign Up
      headerContent += `
        <button id="loginBtn" class="button nav-button bg-blue-600 text-white hover:bg-blue-700 transition duration-150" onclick="openModal('login')">Login</button>
        <button id="signupBtn" class="button nav-button bg-green-500 text-white hover:bg-green-600 transition duration-150" onclick="openModal('signup')">Sign Up</button>
      `;
    }

    // Close the navigation and header structure
    headerContent += `
        </nav>
    `;

    // 4. Finalize Header Injection
    headerDiv.innerHTML = headerContent;
    
    // 5. Attach specific listeners
    attachHeaderButtonListeners();
}

// Automatically call renderHeader when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', renderHeader);
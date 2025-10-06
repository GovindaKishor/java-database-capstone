// --- 1. Import Required Modules (MOCK Placeholders) ---
// NOTE: Replace these mock imports with actual relative imports once files are created.
// import { createDoctorCard } from '../components/doctorCard.js';
// import { openModal } from '../components/modals.js';
// import { getDoctors, filterDoctors } from '../services/doctorServices.js';
// import { patientLogin, patientSignup } from '../services/patientServices.js';

// MOCK implementations for development until actual files are available
const createDoctorCard = (doctor) => {
    const card = document.createElement("div");
    const role = localStorage.getItem("userRole");
    card.classList.add("doctor-card", "p-4", "border", "rounded-lg", "shadow-md", "bg-white/90", "flex", "flex-col", "gap-2", "w-full", "md:w-1/2", "lg:w-1/3");
    card.innerHTML = `
        <div class="doctor-info flex-grow">
            <h3 class="text-xl font-bold text-[#015c5d]">${doctor.name}</h3>
            <p class="text-base text-gray-700">Specialty: ${doctor.specialty}</p>
            <p class="text-sm text-gray-600">Email: ${doctor.email}</p>
            <p class="text-sm font-semibold text-green-700">Available: ${doctor.availability ? doctor.availability.join(", ") : 'N/A'}</p>
        </div>
        <div class="card-actions mt-3">
            <button class="bg-[#017d7e] text-white py-2 px-4 rounded-lg hover:filter hover:brightness-110 transition duration-150 w-full" 
                    onclick="if (localStorage.getItem('userRole') === 'loggedPatient') { 
                        // Mock: Replace with real booking logic
                        alert('Booking appointment with ${doctor.name}...');
                    } else { 
                        openModal('patientLogin');
                    }">
                ${role === 'loggedPatient' ? 'Book Now' : 'Login to Book'}
            </button>
        </div>
    `;
    return card;
};
const openModal = (type) => { console.log(`[MOCK] Opening modal: ${type}`); 
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'flex';
};
const closeModal = () => {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
};
const getDoctors = async () => { console.log("[MOCK] Fetching all doctors..."); return [{id: 1, name: "Dr. Alice", specialty: "Cardiology", email: "a@clinic.com", availability: ["Mon AM", "Tue PM"]}, {id: 2, name: "Dr. Bob", specialty: "Dermatology", email: "b@clinic.com", availability: ["Wed AM", "Fri PM"]}, {id: 3, name: "Dr. Clara", specialty: "Pediatrics", email: "c@clinic.com", availability: ["Wed PM", "Thu AM"]}]; };
const filterDoctors = async (name, time, specialty) => { console.log(`[MOCK] Filtering doctors: ${name}, ${time}, ${specialty}`); return [{id: 1, name: "Dr. Alice", specialty: "Cardiology", email: "a@clinic.com", availability: ["Mon AM", "Tue PM"]}]; };
const patientLogin = async (data) => { console.log("[MOCK] Patient login attempt..."); 
    if (data.email === 'test@patient.com' && data.password === 'pass') return { ok: true, json: async () => ({ token: "mockToken123" }) };
    return { ok: false, json: async () => ({ message: "Invalid credentials" }) };
};
const patientSignup = async (data) => { console.log("[MOCK] Patient signup attempt..."); 
    if (data.email === 'new@patient.com') return { success: false, message: "Email already registered." };
    return { success: true, message: "Signup successful. Please log in." }; 
};


// Expose functions globally for HTML inline event handlers
window.signupPatient = signupPatient;
window.loginPatient = loginPatient;


// --- 2. Utility Function: Render Cards ---
/**
 * Renders a list of doctor cards into the content container.
 * @param {Array<object>} doctors - The list of doctor objects to render.
 */
function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    
    if (!contentDiv) {
        console.error("Content div (#content) not found.");
        return;
    }
    // Clear existing content
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = `<p class="noRecord text-center py-8 text-gray-500 italic">No doctors found matching the current criteria.</p>`;
        return;
    }

    // Wrap cards in a flexible container for responsiveness
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('flex', 'flex-wrap', 'gap-4', 'justify-start');

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        cardWrapper.appendChild(card);
    });

    contentDiv.appendChild(cardWrapper);
}


// --- 3. Initial Load Function ---
/**
 * Fetches all doctors and renders them on the dashboard on page load.
 */
async function loadDoctorCards() {
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Failed to load initial doctor list:", error);
        document.getElementById("content").innerHTML = `<p class="text-red-500 text-center py-8">Error loading doctors. Please check the API status.</p>`;
    }
}


// --- 4. Search and Filter Logic ---
/**
 * Handles input/change events on search bar and filter dropdowns.
 * Fetches and displays filtered results.
 */
async function filterDoctorsOnChange() {
    const searchName = document.getElementById("searchBar")?.value.trim();
    const filterTime = document.getElementById("filterTime")?.value;
    const filterSpecialty = document.getElementById("filterSpecialty")?.value;

    try {
        // Pass empty strings if "All" is selected
        const doctors = await filterDoctors(
            searchName, 
            filterTime === 'all' ? '' : filterTime, 
            filterSpecialty === 'all' ? '' : filterSpecialty
        );

        renderDoctorCards(doctors);
        
    } catch (error) {
        console.error("Failed to filter doctors:", error);
        document.getElementById("content").innerHTML = `<p class="text-red-500 text-center py-8">Error applying filters.</p>`;
    }
}


// --- 5. Authentication Handlers ---
/**
 * Handles the submission of the Patient Signup form.
 */
async function signupPatient() {
    // Collect inputs (assuming modal input IDs are set up)
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    const phone = document.getElementById('signupPhone')?.value.trim();
    const address = document.getElementById('signupAddress')?.value.trim();

    if (!name || !email || !password || !phone || !address) {
        alert("Please fill in all required fields for signup.");
        return;
    }

    const patientData = { name, email, password, phone, address };

    try {
        const result = await patientSignup(patientData);

        if (result.success) {
            alert(result.message);
            closeModal();
            // Redirect or refresh to update header
            window.location.reload(); 
        } else {
            alert(`Signup Failed: ${result.message}`);
        }
    } catch (error) {
        console.error("Patient signup failed:", error);
        alert("An unexpected error occurred during signup.");
    }
}

/**
 * Handles the submission of the Patient Login form.
 */
async function loginPatient() {
    // Collect inputs
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const loginData = { email, password };

    try {
        // patientLogin returns the raw response
        const response = await patientLogin(loginData);

        if (response.ok) {
            const responseData = await response.json();
            const token = responseData.token;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("userRole", "loggedPatient");
                alert("Login successful! Redirecting to dashboard.");
                closeModal();
                // Redirect to the main patient dashboard which now shows logged-in features
                window.location.href = "/pages/patientDashboard.html"; 
            } else {
                alert("Login failed: Authentication token missing.");
            }
        } else {
            const errorData = await response.json();
            alert(`Login Failed: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Patient login failed:", error);
        alert(`An unexpected error occurred: ${error.message}`);
    }
}


// --- 6. Initialization on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Load of All Doctors
    loadDoctorCards();

    // 2. Attach Filter Event Listeners
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("filterTime");
    const filterSpecialty = document.getElementById("filterSpecialty");
    const patientSignupBtn = document.getElementById("patientSignup");
    const patientLoginBtn = document.getElementById("patientLogin");

    if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
    if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
    if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
    
    // 3. Bind Modal Triggers
    if (patientSignupBtn) {
        patientSignupBtn.addEventListener("click", () => openModal("patientSignup"));
    }
    // We check the role from local storage to decide which button text to show, 
    // but the patient login button (if present) should open the login modal.
    if (patientLoginBtn) {
        patientLoginBtn.addEventListener("click", () => openModal("patientLogin"));
    }

});

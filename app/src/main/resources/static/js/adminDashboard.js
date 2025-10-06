// --- 1. Import Required Modules ---
// NOTE: These imports assume correct pathing and exported functions from other modules.
// import { openModal } from '../components/modals.js';
// import { getDoctors, filterDoctors, saveDoctor } from '../services/doctorServices.js';
// import { createDoctorCard } from '../components/doctorCard.js';

// --- MOCK Imports for Runnable Code (Replace with actual imports when available) ---
const openModal = (type) => { console.log(`[MOCK] Opening modal: ${type}`); };
const getDoctors = async () => { console.log("[MOCK] Fetching all doctors..."); return [{id: 1, name: "Dr. Alice", specialty: "Cardiology", email: "a@clinic.com", mobile: "123", availability: ["Mon AM", "Tue PM"]}, {id: 2, name: "Dr. Bob", specialty: "Dermatology", email: "b@clinic.com", mobile: "456", availability: ["Wed AM", "Fri PM"]}]; };
const filterDoctors = async (name, time, specialty) => { console.log(`[MOCK] Filtering doctors: ${name}, ${time}, ${specialty}`); return [{id: 1, name: "Dr. Alice", specialty: "Cardiology", email: "a@clinic.com", mobile: "123", availability: ["Mon AM", "Tue PM"]}]; };
const saveDoctor = async (doctor, token) => { console.log(`[MOCK] Saving doctor: ${doctor.name}`); return { success: true, message: "Doctor saved." }; };
const createDoctorCard = (doctor) => { 
    const card = document.createElement("div");
    card.classList.add("doctor-card", "p-4", "border", "rounded-lg", "shadow-md", "bg-white/90", "flex", "flex-col", "gap-2");
    card.innerHTML = `
        <h3 class="text-xl font-bold text-[#015c5d]">${doctor.name}</h3>
        <p class="text-base text-gray-700">${doctor.specialty}</p>
        <p class="text-sm text-gray-600">Email: ${doctor.email}</p>
        <p class="text-sm text-gray-600">Mobile: ${doctor.mobile}</p>
        <p class="text-sm font-semibold text-green-700">Available: ${doctor.availability ? doctor.availability.join(", ") : 'N/A'}</p>
    `;
    return card;
};
// Expose the handler globally for the modal form's onclick
window.adminAddDoctor = adminAddDoctor;

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
        contentDiv.innerHTML = `<p class="noPatientRecord text-center py-8 text-gray-500 italic">No doctors found matching the current criteria.</p>`;
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}


// --- 3. Initial Load Function ---
/**
 * Fetches all doctors and renders them on the dashboard on page load.
 */
async function loadDoctorCards() {
    // Authentication is primarily handled by header.js, but we need the token for API calls
    const token = localStorage.getItem("token");
    if (!token) {
         console.warn("Admin token not found. Cannot load doctors.");
         // Let header.js handle the redirect/alert
         return;
    }
    
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
        // Pass empty strings if "All" is selected, assuming the service handles it
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


// --- 5. Add Doctor Submission Handler ---
/**
 * Handles the submission of the Add Doctor form in the modal.
 */
async function adminAddDoctor() {
    const token = localStorage.getItem("token");
    if (!token) {
        // IMPORTANT: Use custom logging/modal instead of alert()
        console.error("Authentication required to add a doctor.");
        alert("Session expired. Please log in again.");
        window.location.reload();
        return;
    }

    // --- Collect Data (Assuming modal input IDs are set up in the modal's HTML) ---
    const name = document.getElementById('newDocName')?.value.trim();
    const specialty = document.getElementById('newDocSpecialty')?.value.trim();
    const email = document.getElementById('newDocEmail')?.value.trim();
    const password = document.getElementById('newDocPassword')?.value;
    const mobile = document.getElementById('newDocMobile')?.value.trim();
    
    // --- Collect availability from checkboxes (Assuming class 'docAvailability') ---
    const availabilityCheckboxes = document.querySelectorAll('.docAvailability:checked');
    const availability = Array.from(availabilityCheckboxes).map(cb => cb.value);

    // Basic Validation
    if (!name || !specialty || !email || !password || !mobile || availability.length === 0) {
        alert("Please fill in all required fields and select availability.");
        return;
    }

    const doctorData = { name, specialty, email, password, mobile, availability };

    try {
        // Send Data to Service with Admin Token
        const result = await saveDoctor(doctorData, token);

        if (result.success) {
            console.log("Doctor added successfully:", result.data);
            alert("Doctor added successfully!"); 
            
            // Simple modal close (assuming modal ID)
            const modal = document.getElementById('modal');
            if (modal) modal.style.display = 'none';
            
            // Refresh the doctor list to show the new addition
            await loadDoctorCards();
        } else {
            alert(`Failed to add doctor: ${result.message}`);
        }
    } catch (error) {
        console.error("Admin add doctor failed:", error);
        alert(`An unexpected error occurred: ${error.message}`);
    }
}


// --- 6. Initialization ---
window.onload = function () {
    // --- Initial Load of All Doctors ---
    loadDoctorCards(); 

    // --- Event Listeners for Search and Filters ---
    // The "Add Doctor" button listener is handled by header.js, but we ensure filter listeners are set.
    
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("filterTime");
    const filterSpecialty = document.getElementById("filterSpecialty");
    
    if (searchBar) {
        searchBar.addEventListener("input", filterDoctorsOnChange);
    }
    if (filterTime) {
        filterTime.addEventListener("change", filterDoctorsOnChange);
    }
    if (filterSpecialty) {
        filterSpecialty.addEventListener("change", filterDoctorsOnChange);
    }
};
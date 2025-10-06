// --- 1. Import Required Modules (MOCK Placeholders) ---
// import { getAllAppointments } from './services/appointmentRecordService.js';
// import { createPatientRow } from './components/patientRows.js';

// Mock functions for local testing until actual services/components are implemented
const getAllAppointments = async (date, name, token) => { 
    console.log(`[MOCK] Fetching appointments for Date: ${date}, Name: ${name}`);
    if (name && name.toLowerCase().includes('jane')) {
        return []; // Simulate no results for a specific search
    }
    // Mock data for today
    return [
        { patientId: 101, patientName: "John Doe", phone: "555-0101", email: "john@example.com", prescription: "None", appointmentDate: date },
        { patientId: 102, patientName: "Alice Smith", phone: "555-0202", email: "alice@example.com", prescription: "TBD", appointmentDate: date }
    ];
};
const createPatientRow = (patientData) => {
    const row = document.createElement("tr");
    row.classList.add("patient-row", "hover:bg-gray-50");
    row.innerHTML = `
        <td class="px-6 py-3">${patientData.patientId}</td>
        <td class="px-6 py-3 font-medium">${patientData.patientName}</td>
        <td class="px-6 py-3">${patientData.phone}</td>
        <td class="px-6 py-3">${patientData.email}</td>
        <td class="px-6 py-3">${patientData.prescription}</td>
        <td class="px-6 py-3">
            <button class="prescription-btn bg-[#017d7e] text-white py-1 px-3 rounded-md hover:filter hover:brightness-110 transition duration-150">
                Prescribe
            </button>
        </td>
    `;
    return row;
};


// --- 2. Initialize Global Variables and State ---
const token = localStorage.getItem("token");
let selectedDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
let patientName = null;
let patientTableBody;


// --- Helper Function: Date Formatting ---
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}


// --- 3. Core Logic: Load and Render Appointments ---
/**
 * Fetches appointment data based on the current date and search term,
 * then renders the table rows.
 */
async function loadAppointments() {
    if (!patientTableBody) {
        console.error("Patient table body not found.");
        return;
    }
    
    // Clear existing content and show a loading state
    patientTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">Loading appointments...</td></tr>`;

    if (!token) {
        patientTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500 font-bold">Authentication required. Please log in.</td></tr>`;
        return;
    }

    try {
        // Fetch appointments using current state variables
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        // Clear loading state
        patientTableBody.innerHTML = ""; 

        if (!appointments || appointments.length === 0) {
            patientTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="noPatientRecord text-center py-4 italic text-gray-600">
                        No appointments found for ${selectedDate} ${patientName ? `matching "${patientName}"` : ''}.
                    </td>
                </tr>
            `;
            return;
        }

        // Render each appointment as a table row
        appointments.forEach(appointment => {
            const row = createPatientRow(appointment);
            patientTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load appointments:", error);
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-red-600 font-bold">
                    Error connecting to the service. Please try again.
                </td>
            </tr>
        `;
    }
}


// --- 4. Event Handlers ---
/**
 * Handles the input event on the search bar to filter by patient name.
 */
function handleSearchInput(event) {
    const value = event.target.value.trim();
    patientName = value === "" ? null : value;
    loadAppointments();
}

/**
 * Handles the click event for the "Today's Appointments" button.
 */
function handleTodayButtonClick() {
    const today = getTodayDateString();
    
    // 1. Reset state
    selectedDate = today;
    patientName = null;
    
    // 2. Update UI elements
    const datePicker = document.getElementById("datePicker");
    const searchBar = document.getElementById("searchBar");
    
    if (datePicker) datePicker.value = today;
    if (searchBar) searchBar.value = '';
    
    // 3. Reload data
    loadAppointments();
}

/**
 * Handles the change event on the date picker.
 */
function handleDatePickerChange(event) {
    selectedDate = event.target.value;
    loadAppointments();
}


// --- 5. Initialization on Page Load ---
window.onload = function () {
    patientTableBody = document.getElementById("patientTableBody");
    const datePicker = document.getElementById("datePicker");
    const todayButton = document.getElementById("todayButton");
    const searchBar = document.getElementById("searchBar");

    if (!patientTableBody) {
        console.error("Initialization failed: #patientTableBody element not found.");
        return;
    }

    // 1. Set initial date for date picker
    if (datePicker) {
        datePicker.value = selectedDate;
        datePicker.addEventListener("change", handleDatePickerChange);
    }
    
    // 2. Attach filter event listeners
    if (todayButton) {
        todayButton.addEventListener("click", handleTodayButtonClick);
    }
    if (searchBar) {
        searchBar.addEventListener("input", handleSearchInput);
    }

    // 3. Initial load of today's appointments
    loadAppointments();
};

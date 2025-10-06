// NOTE: Assuming config.js exists in the relative path with API_BASE_URL defined.
// import { API_BASE_URL } from "../config/config.js";
const API_BASE_URL = 'http://localhost:8080/api'; // Mock base URL for development

// Define the base API endpoint for all patient-related operations
const PATIENT_API = API_BASE_URL + '/patient';

/**
 * Helper function to handle fetch errors and return a structured response.
 * @param {Response} response - The fetch API Response object.
 * @returns {Promise<object>} The parsed JSON response.
 * @throws {Error} If the response status is not OK.
 */
async function handleResponse(response) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw new Error(error);
    }
    return data;
}

/**
 * Handles patient sign-up by sending a POST request with patient data.
 * @param {object} data - Patient details (name, email, password, etc.).
 * @returns {Promise<{success: boolean, message: string}>} The operation status.
 */
export async function patientSignup(data) {
    try {
        console.log(`[SERVICE] Signing up new patient at: ${PATIENT_API}/signup`);
        const response = await fetch(`${PATIENT_API}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await handleResponse(response);

        return { success: true, message: json.message || "Registration successful. Please log in." };

    } catch (error) {
        console.error("Error in patientSignup:", error);
        return { success: false, message: error.message || "Sign up failed due to a network or server error." };
    }
}

/**
 * Handles patient login by sending a POST request with credentials.
 * @param {object} data - Login credentials (email, password).
 * @returns {Promise<Response>} The raw fetch response object (for frontend to extract token).
 */
export async function patientLogin(data) {
    try {
        console.log(`[SERVICE] Logging in patient at: ${PATIENT_API}/login`);
        // Log data only in development, avoid logging passwords
        console.log("Attempting login for email:", data.email);

        const response = await fetch(`${PATIENT_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        // Let the calling function handle response.ok and token extraction
        return response;

    } catch (error) {
        console.error("Error in patientLogin:", error);
        // Throw an error for the caller to handle UI feedback
        throw new Error(error.message || "Failed to connect to the login service.");
    }
}

/**
 * Fetches the data for the currently logged-in patient.
 * @param {string} token - The patient's JWT authentication token.
 * @returns {Promise<object | null>} The patient data object or null on failure.
 */
export async function getPatientData(token) {
    try {
        console.log(`[SERVICE] Fetching patient profile data...`);
        const response = await fetch(`${PATIENT_API}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return await handleResponse(response);

    } catch (error) {
        console.error("Error in getPatientData:", error);
        // IMPORTANT: Log error and return null for graceful failure
        return null;
    }
}

/**
 * Fetches appointments for a patient or doctors viewing their patient's appointments.
 * The endpoint logic will vary based on user type, but the frontend request is unified.
 * @param {number} id - The patient's unique identifier.
 * @param {string} token - The authentication token.
 * @param {string} user - String indicating the caller's role ("patient" or "doctor").
 * @returns {Promise<Array | null>} A list of appointment objects or null on failure.
 */
export async function getPatientAppointments(id, token, user) {
    let url = `${PATIENT_API}/appointments?patientId=${id}`; // Example unified endpoint

    // If a doctor is viewing, they might hit a different endpoint or use different params
    if (user === "doctor") {
        url = `${API_BASE_URL}/doctor/patient-appointments?patientId=${id}`;
    }

    try {
        console.log(`[SERVICE] Fetching appointments for user (${user}) at: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return await handleResponse(response);

    } catch (error) {
        console.error(`Error in getPatientAppointments (User: ${user}):`, error);
        return null;
    }
}

/**
 * Retrieves a filtered list of appointments based on status and/or patient/doctor name.
 * @param {string} [condition] - Appointment status (e.g., "pending", "consulted").
 * @param {string} [name] - Patient or Doctor name to filter by.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array>} A list of filtered appointments or an empty array on failure.
 */
export async function filterAppointments(condition = '', name = '', token) {
    try {
        const params = new URLSearchParams();
        if (condition) params.append('condition', condition);
        if (name) params.append('name', name);

        const url = `${PATIENT_API}/appointments/filter?${params.toString()}`;
        console.log(`[SERVICE] Filtering appointments at: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return await handleResponse(response);

    } catch (error) {
        console.error("Error in filterAppointments:", error);
        // IMPORTANT: Use logging instead of alert()
        console.warn("Could not filter appointments. Check network connection.");
        return [];
    }
}


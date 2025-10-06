// NOTE: Assuming config.js exists in the relative path with API_BASE_URL defined.
// import { API_BASE_URL } from "../config/config.js";
const API_BASE_URL = 'http://localhost:8080/api'; // Mock base URL for development

// Define the base API endpoint for all doctor-related operations
const DOCTOR_API = API_BASE_URL + '/doctor';

/**
 * Sends a GET request to retrieve all doctor records.
 * @returns {Promise<Array>} A list of doctor objects or an empty array on failure.
 */
export async function getDoctors() {
    try {
        console.log(`[SERVICE] Fetching all doctors from: ${DOCTOR_API}`);
        const response = await fetch(DOCTOR_API);
        
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`Failed to fetch doctors: ${response.statusText}`);
        }

        // Return the JSON data (list of doctors)
        return await response.json();

    } catch (error) {
        console.error("Error in getDoctors:", error);
        // Return an empty list to prevent the frontend from crashing
        return [];
    }
}

/**
 * Sends a DELETE request to remove a doctor from the system.
 * Requires an Admin authentication token.
 * @param {number} id - The ID of the doctor to delete.
 * @param {string} token - The Admin's JWT token.
 * @returns {Promise<{success: boolean, message: string}>} The operation status.
 */
export async function deleteDoctor(id, token) {
    try {
        const url = `${DOCTOR_API}/${id}`;
        console.log(`[SERVICE] Deleting doctor ${id} at: ${url}`);
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 204) {
            // Success with No Content (common for DELETE)
            return { success: true, message: `Doctor ID ${id} deleted successfully.` };
        } 
        
        // Handle other responses (e.g., 404 Not Found, 401 Unauthorized)
        const json = await response.json();
        throw new Error(json.message || `Deletion failed with status: ${response.status}`);


    } catch (error) {
        console.error(`Error in deleteDoctor (ID: ${id}):`, error);
        return { success: false, message: error.message || "Failed to delete doctor due to a network or server error." };
    }
}

/**
 * Sends a POST request to save a new doctor record.
 * Requires an Admin authentication token.
 * @param {object} doctor - The doctor data object.
 * @param {string} token - The Admin's JWT token.
 * @returns {Promise<{success: boolean, message: string, data?: object}>} The operation status and saved data.
 */
export async function saveDoctor(doctor, token) {
    try {
        console.log(`[SERVICE] Saving new doctor to: ${DOCTOR_API}`);
        const response = await fetch(DOCTOR_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(doctor)
        });
        
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || `Failed to save doctor with status: ${response.status}`);
        }

        return { success: true, message: "Doctor saved successfully.", data: json };

    } catch (error) {
        console.error("Error in saveDoctor:", error);
        return { success: false, message: error.message || "Failed to save doctor due to a network or server error." };
    }
}

/**
 * Sends a GET request to retrieve a filtered list of doctors.
 * @param {string} [name] - Optional doctor name to filter by.
 * @param {string} [time] - Optional availability time (e.g., "AM", "PM").
 * @param {string} [specialty] - Optional medical specialty to filter by.
 * @returns {Promise<Array>} A list of filtered doctor objects or an empty array on failure.
 */
export async function filterDoctors(name = '', time = '', specialty = '') {
    try {
        // Build the query parameters dynamically, excluding empty values
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (time) params.append('time', time);
        if (specialty) params.append('specialty', specialty);

        const url = `${DOCTOR_API}/filter?${params.toString()}`;
        console.log(`[SERVICE] Filtering doctors at: ${url}`);
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to filter doctors: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error in filterDoctors:", error);
        // Return an empty list to maintain application stability
        return [];
    }
}
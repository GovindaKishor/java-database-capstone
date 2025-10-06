/**
 * Utility functions are expected to be available globally or imported, such as:
 * - deleteDoctorFromAPI(id, token): Function to call the backend delete endpoint.
 * - showBookingOverlay(event, doctor, patientData): Function to display the patient booking modal.
 * - getPatientData(token): Function to fetch the logged-in patient's profile.
 * * NOTE: For this component to work fully, the dependent functions (like deleteDoctorFromAPI, 
 * getPatientData, and showBookingOverlay) must be defined and imported/exposed globally 
 * in the context where this card is used.
 */

// Placeholder function for client-side deletion confirmation (as we cannot use alert/confirm)
function confirmDeletion(doctorName) {
    // In a real application, this would show a custom modal for confirmation.
    console.log(`Confirmation required to delete doctor: ${doctorName}`);
    return true; // Assume confirmation for now
}

/**
 * Creates a reusable doctor card element with dynamic content and role-specific actions.
 * @param {object} doctor - The doctor data object (e.g., {id: 1, name: "Dr. Smith", specialty: "Cardiology", ...})
 * @returns {HTMLElement} The dynamically created doctor card div.
 */
export function createDoctorCard(doctor) {
    // 1. Create the Main Card Container
    const card = document.createElement("div");
    card.classList.add("doctor-card", "bg-white", "rounded-xl", "shadow-lg", "overflow-hidden", "flex", "flex-col", "transform", "hover:scale-[1.02]", "transition", "duration-300");
    
    // Set a data attribute for easy identification/removal
    card.dataset.doctorId = doctor.id;

    // 2. Fetch the User’s Role
    const role = localStorage.getItem("userRole");

    // 3. Create Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info", "p-6", "flex-grow", "space-y-2");
    
    // Name
    const name = document.createElement("h3");
    name.classList.add("text-2xl", "font-bold", "text-gray-900");
    name.textContent = doctor.name || "N/A";

    // Specialization
    const specialization = document.createElement("p");
    specialization.classList.add("text-lg", "font-semibold", "text-blue-600");
    specialization.textContent = doctor.specialty || "General Practice";

    // Email
    const email = document.createElement("p");
    email.classList.add("text-gray-600", "text-sm");
    email.innerHTML = `<span class="font-medium">Email:</span> ${doctor.email || "N/A"}`;

    // Availability (Handles array of strings or single string)
    const availabilityText = Array.isArray(doctor.availability) 
        ? doctor.availability.join(", ") 
        : (doctor.availability || "Not specified");
        
    const availability = document.createElement("p");
    availability.classList.add("text-sm", "text-gray-700");
    availability.innerHTML = `<span class="font-medium">Availability:</span> ${availabilityText}`;

    // Append info elements to the info container
    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // 4. Create Button Container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions", "mt-auto");
    
    // 5. Conditionally Add Buttons Based on Role
    if (role === "admin") {
        // Admin: Delete Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete Doctor";
        removeBtn.classList.add("button", "bg-red-600", "hover:bg-red-700", "text-white", "w-full", "py-3");
        
        removeBtn.addEventListener("click", async () => {
            if (confirmDeletion(doctor.name)) {
                try {
                    const token = localStorage.getItem("token");
                    
                    // --- Placeholder for API Call ---
                    // Assuming deleteDoctorFromAPI is a globally available function (or imported)
                    // await deleteDoctorFromAPI(doctor.id, token); 
                    
                    console.log(`[API CALL]: Deleting doctor ID ${doctor.id}`); // Replace with actual API call
                    
                    // On successful deletion: remove the card from the DOM
                    card.remove(); 
                    console.log(`Doctor ${doctor.name} successfully deleted.`);
                    // --- End Placeholder ---
                    
                } catch (error) {
                    console.error("Error deleting doctor:", error);
                    // Handle error (e.g., display error message to admin)
                }
            }
        });
        actionsDiv.appendChild(removeBtn);
        
    } else if (role === "patient") {
        // Patient (not logged in): Book Now (requires login)
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now (Login Required)";
        bookNow.classList.add("button", "bg-gray-400", "cursor-not-allowed", "text-white", "w-full", "py-3");
        
        bookNow.addEventListener("click", () => {
             // IMPORTANT: Cannot use alert(). Log an instruction instead.
            console.warn("Patient needs to login first. Triggering login modal...");
            // Assuming openModal is a globally available function
            if (typeof openModal === 'function') {
                openModal('login');
            }
        });
        actionsDiv.appendChild(bookNow);
        
    } else if (role === "loggedPatient") {
        // Logged-in Patient: Book Now (full action)
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Appointment";
        bookNow.classList.add("button", "bg-green-600", "hover:bg-green-700", "text-white", "w-full", "py-3");
        
        bookNow.addEventListener("click", async (e) => {
            try {
                const token = localStorage.getItem("token");
                
                // --- Placeholder for API Call & UI Logic ---
                // Assuming getPatientData and showBookingOverlay are available
                // const patientData = await getPatientData(token); 
                const patientData = { id: 101, name: "Current Patient", phone: "555-1234" }; // Mock data
                
                if (typeof showBookingOverlay === 'function') {
                    showBookingOverlay(e, doctor, patientData);
                } else {
                    console.error("showBookingOverlay function is not defined.");
                }
                // --- End Placeholder ---
                
            } catch (error) {
                console.error("Error initiating booking:", error);
            }
        });
        actionsDiv.appendChild(bookNow);
    }
    
    // 6. Final Assembly
    card.appendChild(infoDiv);
    
    // Only append actions if there are buttons to show
    if (actionsDiv.children.length > 0) {
        card.appendChild(actionsDiv);
    }

    // 7. Return the final card
    return card;
}
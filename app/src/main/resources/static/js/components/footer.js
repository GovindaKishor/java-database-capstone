/**
 * Renders the static footer content into the placeholder div.
 * The footer remains consistent across all application pages.
 */
function renderFooter() {
    // 1. Access the Footer Container
    const footer = document.getElementById("footer");

    // Exit if the footer placeholder is not found
    if (!footer) {
        return;
    }

    // Get the current year for copyright information
    const currentYear = new Date().getFullYear();

    // 2. Inject HTML Content (using a template literal for multi-line HTML)
    footer.innerHTML = `
        <footer class="footer p-8 bg-gray-900 text-white mt-12">
            <div class="footer-grid max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                
                <!-- Branding and Copyright Section -->
                <div class="footer-logo col-span-2 md:col-span-1 flex flex-col items-start space-y-3">
                    <div class="flex items-center space-x-2">
                        <!-- Placeholder for Logo image -->
                        <img src="/assets/images/logo.png" alt="Smart Clinic Logo" class="w-8 h-8 rounded-full">
                        <h4 class="text-xl font-bold text-blue-400">Smart Clinic</h4>
                    </div>
                    <p class="text-sm text-gray-400 mt-2">
                        &copy; Copyright ${currentYear} Smart Clinic. All rights reserved.
                    </p>
                    <p class="text-xs text-gray-500">
                        Integrated Health Management System.
                    </p>
                </div>

                <!-- Column 1: Company Links -->
                <div class="footer-column">
                    <h5 class="text-lg font-semibold mb-4 text-blue-300">Company</h5>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">About Us</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Careers</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Press & Media</a></li>
                    </ul>
                </div>

                <!-- Column 2: Support Links -->
                <div class="footer-column">
                    <h5 class="text-lg font-semibold mb-4 text-blue-300">Support</h5>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">My Account</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Help Center</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Column 3: Legal Links -->
                <div class="footer-column">
                    <h5 class="text-lg font-semibold mb-4 text-blue-300">Legal</h5>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Terms of Service</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Privacy Policy</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-blue-200 transition duration-150">Licensing</a></li>
                    </ul>
                </div>
            </div>
            <div class="text-center pt-8 border-t border-gray-700 mt-8">
                <p class="text-sm text-gray-500">
                    Disclaimer: This is a sample application for educational purposes.
                </p>
            </div>
        </footer>
    `;
}

// 3. Call the Function immediately when the script loads
renderFooter();
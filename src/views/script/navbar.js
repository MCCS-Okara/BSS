// Get all dropdown buttons and menus
const dropdownButtons = document.querySelectorAll('[role="menu"] > button');
const dropdownMenus = document.querySelectorAll('[role="menu"] > div');

// Function to close all dropdowns
const closeAllDropdowns = () => {
    dropdownMenus.forEach(menu => menu.classList.add('hidden'));
};

// Add click event to each dropdown button
dropdownButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to document

        // Close other dropdowns first
        closeAllDropdowns();
 
        // Toggle the current dropdown menu
        const menu = dropdownMenus[index];
        menu.classList.toggle('hidden');
    });
});

// Close all dropdowns when clicking outside
document.addEventListener('click', () => {
    closeAllDropdowns();
});

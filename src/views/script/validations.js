// add event listner on input 
function handleInput(event) {
  const input = event.target;

  // Check if input has value
  if (input.value.trim()) {
      input.classList.remove('border-gray-300'); // Remove default gray border
      input.classList.add('border-green-500');  // Add green border
  } else {
      input.classList.remove('border-green-500'); // Remove green border if empty
      input.classList.add('border-gray-300');    // Reapply default gray border
  }
}
 
 
 //javascript function to check the cnic
 const cnicInput = document.getElementById('cnic');
if(cnicInput){

  // Add input event listener to dynamically validate input
  cnicInput.addEventListener('input', (e) => {
  // Remove all characters except numbers and dashes
  let value = e.target.value.replace(/[^0-9-]/g, '');

  // Add dashes at specific positions for CNIC format: #####-#######-#
  if (value.length > 5 && value.indexOf('-') !== 5) {
    value = value.slice(0, 5) + '-' + value.slice(5);
  }
  if (value.length > 13 && value.lastIndexOf('-') !== 13) {
    value = value.slice(0, 13) + '-' + value.slice(13);
  }

  // Limit input to 15 characters (11 digits + 2 dashes)
  e.target.value = value.slice(0, 15);

  // Dynamically check for validity
  if (value.match(/^\d{5}-\d{7}-\d{1}/)) {
    cnicInput.classList.add('border-green-500'); // Add green border for valid input
    cnicInput.classList.remove('border-red-500'); // Remove red border
  } else {
    cnicInput.classList.add('border-red-500'); // Add red border for invalid input
    cnicInput.classList.remove('border-green-500'); // Remove green border
  }
});
}


const contactInput = document.getElementById('contact1') ||document.getElementById('contact');
if (contactInput){
  // Add input event listener for contact number formatting
  contactInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters

  // Insert dash after the first 4 characters (if not already present)
  if (value.length > 4) {
    value = value.slice(0, 4) + '-' + value.slice(4);
  }
  
  // Limit input to 12 characters (4 digits + 1 dash + 7 digits)
  e.target.value = value.slice(0, 12);
  
  // Add dynamic validation (optional)
  if (value.match(/^03\d{2}-\d{7}/)) {
    contactInput.classList.add('border-green-500'); // Valid format
    contactInput.classList.remove('border-red-500'); // Remove invalid indicator
  } else {
    contactInput.classList.add('border-red-500'); // Invalid format
    contactInput.classList.remove('border-green-500'); // Remove valid indicator
  }
});
}
const contactInput2 = document.getElementById('contact2');
if(contactInput2){
  // Add input event listener for contact number formatting
  contactInput2.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    
    // Insert dash after the first 4 characters (if not already present)
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
  }

  // Limit input to 12 characters (4 digits + 1 dash + 7 digits)
  e.target.value = value.slice(0, 12);
  
  // Add dynamic validation (optional)
  if (value.match(/^03\d{2}-\d{7}/)) {
    contactInput2.classList.add('border-green-500'); // Valid format
    contactInput2.classList.remove('border-red-500'); // Remove invalid indicator
  } else {
    contactInput2.classList.add('border-red-500'); // Invalid format
    contactInput2.classList.remove('border-green-500'); // Remove valid indicator
  }
});
}
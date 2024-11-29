// Validates phone numbers with simple rules
export const phoneNumberValidator = (phone) => {
    // Regex pattern for validating phone numbers
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    // Check if the phone number matches the pattern
    return phoneRegex.test(phone);
};
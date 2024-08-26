// Validates the email format based on specific regex patterns for the user and domain parts
export const emailValidator = (email) => {
    // Regex pattern to validate the "user" part of the email (before the @ symbol)
    // The pattern allows either a dot-atom format or a quoted-string format
    const userRegex = /^(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*$|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*"$)/i;

    // Regex pattern to validate the "domain" part of the email (after the @ symbol)
    // The pattern allows domain names that match the RFC standards, including domain labels up to 63 characters
    const domainRegex = /^((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z0-9-]{2,63}(?<!-))$/i;

    // Regex pattern to validate the "domain" part as an IP address (IPv4 or IPv6) enclosed in square brackets
    const literalRegex = /^\[([A-F0-9:.]+)\]$/i;

    // Split the email into user and domain parts using the "@" symbol
    const [userPart, domainPart] = email.split('@');

    // Check if either user or domain parts are missing or if the email exceeds 254 characters
    if (!userPart || !domainPart || email.length > 254) {
        return false;
    }

    // Validate the "user" part of the email against the userRegex pattern
    if (!userRegex.test(userPart)) {
        return false;
    }

    // Validate the "domain" part of the email against the domainRegex and literalRegex patterns
    if (!domainRegex.test(domainPart) && !literalRegex.test(domainPart)) {
        return false;
    }

    // If all validations pass, return true (the email is valid)
    return true;
};
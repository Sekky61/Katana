// Utility functions without a better place

// Read the user id from the url parameters
export function readUserIDFromParams(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
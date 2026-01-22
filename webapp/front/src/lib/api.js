/**
 * Helper function for making authenticated API requests.
 * Automatically handles 401 Unauthorized responses by redirecting to login.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @returns {Promise<Response>} - The fetch response.
 */
export const fetchWithAuth = async (url, options = {}) => {
    const defaultHeaders = {
        'Accept': 'application/json',
        ...options.headers,
    };

    const config = {
        ...options,
        credentials: 'include', // Ensure cookies are sent
        headers: defaultHeaders,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            console.warn("User not authenticated or session expired. Redirecting to login...");
            window.location.href = '/login';
            // Returning a rejected promise to stop further processing in the caller
            return Promise.reject(new Error("Unauthorized"));
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://memoai-m7ho.onrender.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

// Build the default JSON headers and attach the saved auth token when available.
const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Send one API request, parse the response, and normalize backend errors.
    async request(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
            if (endpoint.startsWith('/auth/')) {
                throw new Error(data.message || 'Invalid email or password');
            }

            auth.logout();
            // Redirect expired sessions unless the user is already on a public page.
            const publicPages = ['/Login', '/Signup', '/', '/forgot-password', '/reset-password', '/verify-otp'];
            if (!publicPages.includes(window.location.pathname)) {
                window.location.href = '/Login';
            }
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    },

    // Fetch data from the backend with the current auth headers.
    async get(endpoint) {
        try {
            return await this.request(endpoint, {
                method: 'GET',
                headers: getHeaders(),
            });
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Server connection failed. Please try again later.');
            }
            throw error;
        }
    },

    // Create backend data, using JSON by default or FormData for uploads.
    async post(endpoint, body, isFormData = false) {
        const headers = isFormData ? {} : getHeaders();
        if (isFormData) {
             const token = localStorage.getItem('token');
             if (token) {
                 headers['Authorization'] = `Bearer ${token}`;
             }
        }

        try {
            return await this.request(endpoint, {
                method: 'POST',
                headers: headers,
                body: isFormData ? body : JSON.stringify(body),
            });
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Server connection failed. Please try again later.');
            }
            throw error;
        }
    },

    // Update backend data, using JSON by default or FormData when needed.
    async patch(endpoint, body, isFormData = false) {
        const headers = isFormData ? {} : getHeaders();
         if (isFormData) {
             const token = localStorage.getItem('token');
             if (token) {
                 headers['Authorization'] = `Bearer ${token}`;
             }
        }

        try {
            return await this.request(endpoint, {
                method: 'PATCH',
                headers: headers,
                body: isFormData ? body : JSON.stringify(body),
            });
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Server connection failed. Please try again later.');
            }
            throw error;
        }
    },

    // Delete backend data with the current auth headers.
    async delete(endpoint) {
        try {
            return await this.request(endpoint, {
                method: 'DELETE',
                headers: getHeaders(),
            });
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Server connection failed. Please try again later.');
            }
            throw error;
        }
    },
};

export const auth = {
    // Register a new user and save auth data when the backend returns it.
    async register(name, email, password) {
        const data = await api.post('/auth/register', { name, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    // Log in with email and password, then save the returned session data.
    async login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    // Log in with a Google token and save the returned session data.
    async googleLogin(token) {
        const data = await api.post('/auth/google', { token });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    // Verify an OTP code and save auth data when verification logs the user in.
    async verifyOTP(email, otp) {
        const data = await api.post('/auth/verify-otp', { email, otp });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    // Request a fresh OTP code for an unverified account.
    async resendOTP(email) {
        return await api.post('/auth/resend-otp', { email });
    },

    // Start the password reset flow by asking the backend to email an OTP.
    async forgotPassword(email) {
        return await api.post('/auth/forgot-password', { email });
    },

    // Complete password reset with the email, OTP, and new password.
    async resetPassword(email, otp, newPassword) {
        return await api.post('/auth/reset-password', { email, otp, newPassword });
    },

    // Clear all locally saved session data.
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('u  ser');
        localStorage.removeItem('latestRecording');
    },

    // Read the saved user object from localStorage.
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Fetch the latest user profile and refresh the saved local copy.
    async getProfile() {
        const data = await api.get('/user/profile');
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
};

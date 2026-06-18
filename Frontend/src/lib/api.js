export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://memoai-m7ho.onrender.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

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
    async request(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (response.status === 401) {
            auth.logout();
            // Only redirect if we're not already on a public page
            const publicPages = ['/Login', '/Signup', '/', '/forgot-password', '/reset-password', '/verify-otp'];
            if (!publicPages.includes(window.location.pathname)) {
                window.location.href = '/Login';
            }
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Something went wrong');
        }

        return response.json();
    },

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
    async register(name, email, password) {
        const data = await api.post('/auth/register', { name, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    async login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    async googleLogin(token) {
        const data = await api.post('/auth/google', { token });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    async verifyOTP(email, otp) {
        const data = await api.post('/auth/verify-otp', { email, otp });
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    async resendOTP(email) {
        return await api.post('/auth/resend-otp', { email });
    },

    async forgotPassword(email) {
        return await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(email, otp, newPassword) {
        return await api.post('/auth/reset-password', { email, otp, newPassword });
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('latestRecording');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async getProfile() {
        const data = await api.get('/user/profile');
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
};

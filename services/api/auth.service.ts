import api from '@/services/api/client';

interface LoginCredentials {
    email: string;
    password: string;
  }
  interface UsernameCheckResponse {
    available: boolean;
    message?: string;
  }

export const authService = {
    login: async (credentials : LoginCredentials) => {
        try{

        const response = await api.post('/auth/login', credentials);
        console.log('Auth Service - Login Response: user is creating', response.image_url, response.image_key);
        return {
            user: {
                id: response.user.id,
                email: response.user.user_metadata.email,
                name: response.user.user_metadata.name,
                type: response.user.user_metadata.type,
                username: response.user.user_metadata.username,
                houseId: response.house_id,
                image_key: response.image_key,
                image_url: response.image_url
              },
              token: response.session.access_token,
              refreshToken: response.session.refresh_token,
              expiresIn: response.session.expires_in

        };
        } catch(error){
            console.log('Auth Service - Login Error:', {
                response: error.response,
                data: error.response?.data,
                status: error.response?.status
              });
        
        throw error;
        }
    },
     
    register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          return response.data;
        } catch (error) {
          console.error('Register error:', error);
          throw error;
        }
      },
    
      verifyEmail: async (email: string, token: string) => {
        try {
          const response = await api.post('/auth/verify-email', { email, token });
          return response;
        } catch (error) {
          console.error('Email verification error:', error);
          throw error;
        }
      },
    
      resendOTP: async (email: string) => {
        try {
          const response = await api.post('/auth/resend-otp', { email });
          return response.data;
        } catch (error) {
          console.error('Resend OTP error:', error);
          throw error;
        }
      },
    // Check username availability - Updated to use your existing backend endpoint
    checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    try {
      // Use the endpoint you provided
      const response = await api.get(`/auth/username/${username}`);
      return response.data;
      } catch (error) {
      console.error('Check username error:', error);
      throw error.response?.data || error;
      }
    },

    // Send email Verification code
   
    sendVerificationCode: async (email: string) => {
      try {
        const response = await api.post('/auth/send-verification', { email });
        console.log('Send verification code response:', response);
        return response;
      } catch (error) {
        console.error('Send verification code error:', error);
        throw error.response?.data || error;
      }
    },

    // Verify email code
    verifyCode: async (email: string, code: string) => {
      try {
        const response = await api.post('/auth/verify-code', { email, code });
        return response;
      } catch (error) {
        console.error('Verify code error:', error);
        throw error.response?.data || error;
      }
    },

  // Request password reset
  resetPasswordRequest: async (email: string): Promise<any> => {
    try {
      const response = await api.post('/auth/reset-password-request', { email });
      return response.data;
    } catch (error) {
      console.error('Reset password request error:', error);
      throw error.response?.data || error;
    }
  },

  // Update password (requires auth token)
  updatePassword: async (password: string, refreshToken?: string) => {
    try {
      const response = await api.post('/auth/update-password', { 
        password, refreshToken 
      });
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error.response?.data || error;
    }
  },

   // Refresh token
   refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error.response?.data || error;
    }
  },

// Logout endpoint
logout: async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || error;
  }
}

    };
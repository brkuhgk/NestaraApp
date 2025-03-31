import api from '@/services/api/client';

interface LoginCredentials {
    email: string;
    password: string;
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
          return response;
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
          return response;
        } catch (error) {
          console.error('Resend OTP error:', error);
          throw error;
        }
      }
     
    };
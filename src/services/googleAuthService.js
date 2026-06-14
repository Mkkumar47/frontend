import api from './api';

export const googleAuthService = {
  // Login with Google OAuth token
  googleLogin: (credentialResponse) => {
    const { credential } = credentialResponse;
    return api.post('/auth/google-login', { token: credential }).then(r => r.data);
  },

  // Register with Google OAuth token
  googleRegister: (credentialResponse) => {
    const { credential } = credentialResponse;
    return api.post('/auth/google-register', { token: credential }).then(r => r.data);
  }
};

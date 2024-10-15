import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.battlefold.xyz';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authenticateTelegram = async (telegramInitData: string) => {
  try {
    const response = await api.post('/auth/telegram', { init_data: telegramInitData });
    return response.data;
  } catch (error) {
    console.error('Telegram authentication failed:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const logout = async (refreshToken: string) => {
  try {
    await api.post('/auth/logout', { refresh_token: refreshToken });
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get user info:', error);
    throw error;
  }
};

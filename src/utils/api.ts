import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.battlefold.xyz';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authenticateTelegram = async (telegramInitData: string) => {
  console.log('Sending authentication request to:', `${API_BASE_URL}/auth/telegram`);
  console.log('Telegram init data:', telegramInitData);
  
  try {
    const parsedInitData = Object.fromEntries(new URLSearchParams(telegramInitData));
    const user = JSON.parse(parsedInitData.user);
    
    const requestBody = {
      id: user.id,
      username: user.username,
      photoUrl: user.photo_url,
      lastName: user.last_name,
      firstName: user.first_name,
      isBot: user.is_bot,
      isPremium: user.is_premium,
      languageCode: user.language_code,
      allowsWriteToPm: user.allows_write_to_pm,
      addedToAttachmentMenu: user.added_to_attachment_menu,
    };

    console.log('Request body:', requestBody);

    const response = await api.post('/auth/telegram', requestBody);
    console.log('Authentication response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Telegram authentication failed:', error.response?.data || error.message);
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
  console.log('Fetching user info');
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('User info response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get user info:', error.response?.data || error.message);
    throw error;
  }
};

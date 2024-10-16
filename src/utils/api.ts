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


//request to API and get latestGames
//rooms/lastStarted
export const getLastStartedRoom = async () => {

  const accessToken = localStorage.getItem('accessToken');
  console.log(accessToken);
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.get('/rooms/lastStarted', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Failed to get latest games:', error.response?.data || error.message);
    throw error;
  }
}

//createRoom
// post to /rooms
export const createRoom = async () => {

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.post('/rooms', {
      "capacity": 2,
      "type": "BOT",
      "amount": "0"
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create room:', error.response?.data || error.message);
    throw error;
  }
}

//get room by id
export const getRoomById = async (roomId: string) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.get(`/rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to get room:', error.response?.data || error.message);
    throw error;
  }
}

//patch room data and status and points
//patch /rooms/{roomId}/roomParty
export const updateRoom = async (roomId: string, data: any) => {

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await api.patch(`/rooms/${roomId}/roomParty`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update room:', error.response?.data || error.message);
    throw error;
  }
}
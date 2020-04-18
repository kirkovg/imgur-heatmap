const BASE_API = 'https://api.imgur.com/3';

export default async (userName, resource) => {
  const response = await fetch(`${BASE_API}/account/${userName}/${resource}/newest`, {
    method: 'GET',
    headers: {
      Authorization: process.env.SECRET_KEY
    }
  });
  if (response.status === 404) {
    return 'Username not found';
  }
  try {
    return response.json().then(responseJson => responseJson.data);
  } catch (e) {
    return 'Unexpected error';
  }
};

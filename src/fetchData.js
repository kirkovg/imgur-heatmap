const BASE_API = 'https://api.imgur.com/3';


export const fetchData = async (userName, resource) => {
  const response = await fetch(`${BASE_API}/${userName}/${resource}`, {
    method: 'GET',
    headers: {
      'Authorization': process.env.SECRET_KEY
    }
  });
  return await response.json();
};

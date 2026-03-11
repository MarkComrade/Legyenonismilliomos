const getMethodFetch = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GET hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
}

const postMethodFetch = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`POST hiba: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(`Hiba történt: ${error.message}`);
    });
}; 

export const postItemsServ = async <TRequest, TResponse>(
  url: string,
  newUserObj: TRequest,
  headers: Record<string, string> = { 'Content-Type': 'application/json' }
): Promise<TResponse> => {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(newUserObj)
  });

  return (await res.json()) as TResponse;
};

export const deleteItemServ = async (url: string) => {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await res.json();
};

export const putItemServ = async <TRequest, TResponse>(
  url: string,
  updatedObj: TRequest,
  headers: Record<string, string> = { 'Content-Type': 'application/json' }
): Promise<TResponse> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedObj)
  });

  return (await res.json()) as TResponse;
};

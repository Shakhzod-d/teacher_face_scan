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

export const postTeacherImage = async (teacher: FormData, teacherId: string) => {
  return (
    await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/v1/teacher/face/recognize/by/id?teacherId=${teacherId}`, {
      method: 'POST',
      headers: {
        accept: '*/*'
      },
      body: teacher
    })
  ).json();
};

export const postRegisterTeacherImage = async (teacher: FormData, teacherId: string) => {
  return (
    await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/v1/teacher/face/register?teacherId=${teacherId}`, {
      method: 'POST',
      headers: {
        accept: '*/*'
      },
      body: teacher
    })
  ).json();
};

export const fetchItemsServ = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data: T = await res.json();
  return data;
};

export const fetchImagesServ = async (url: string): Promise<Blob> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return await res.blob();
};

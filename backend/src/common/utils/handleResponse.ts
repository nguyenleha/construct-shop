export const handleResponseRemoveKey = (response: any) => {
  delete response.password;
  delete response.isActive;
  delete response.isDeleted;
  delete response.deleted_at;
  delete response.refreshToken;
  return response;
};

export const handleResponseRemoveKeyList = (response: any) => {
  const data = response.map((rest) => handleResponseRemoveKey(rest));
  return data;
};

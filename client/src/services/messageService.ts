import api from "./api";

export const getRoomMessages = async (roomId: string) => {
  const response = await api.get(`/messages/${roomId}`);

  return response.data;
};
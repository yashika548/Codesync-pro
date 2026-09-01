import api from "./api";

export interface Room {
  _id: string;
  roomId: string;
  host: string;
  participants: string[];
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export const createRoom = async () => {
  const response = await api.post("/rooms");

  return response.data;
};

export const joinRoom = async (roomId: string) => {
  const response = await api.post("/rooms/join", {
    roomId,
  });

  return response.data;
};

export const updateRoomLanguage = async (
  roomId: string,
  language: string
) => {
  const response = await api.patch(
    `/rooms/${roomId}/language`,
    { language }
  );

  return response.data;
};

export const getRoom = async (roomId: string) => {
  const response = await api.get(`/rooms/${roomId}`);

  return response.data;
};

export const updateRoomCode = async (
  roomId: string,
  code: string
) => {
  const response = await api.put(`/rooms/${roomId}/code`, {
    code,
  });

  return response.data;
};
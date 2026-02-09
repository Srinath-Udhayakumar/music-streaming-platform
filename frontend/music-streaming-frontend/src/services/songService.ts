import axios from "axios";
import type { Song } from "../types/Song";

const API_URL = "http://localhost:8081/api/songs";

export const getSongs = async (): Promise<Song[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

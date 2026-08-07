import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  username?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page || 1,
      perPage: params.perPage || 12,
      ...(params.search && { search: params.search }),
      ...(params.tag && params.tag !== "all" && { tag: params.tag }),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>("/notes", newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (
  credentials: RegisterCredentials,
): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
};

export const login = async (credentials: RegisterCredentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkSession = async () => {
  const response = await api.get("/auth/session");
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (userData: UpdateUserPayload): Promise<User> => {
  const response = await api.patch<User>("/users/me", userData);
  return response.data;
};

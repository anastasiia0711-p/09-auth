import { cookies } from "next/headers";
import { api } from "./api";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";

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

export interface UserProfile {
  id?: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page || 1,
      perPage: params.perPage || 12,
      ...(params.search && { search: params.search }),
      ...(params.tag && params.tag !== "all" && { tag: params.tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<UserProfile> => {
  const cookieStore = await cookies();

  const response = await api.get<UserProfile>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
  const cookieStore = await cookies();

  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
export const refreshSession = async (): Promise<AxiosResponse> => {
  const cookieStore = await cookies();

  const response = await api.post(
    "/auth/refresh",
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return response;
};

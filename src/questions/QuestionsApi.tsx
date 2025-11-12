import axios from "axios";
import { environment } from "../system/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IQuestion {
  _id: string;
  articleId: string;
  userId: string;
  question: string;
  answer?: string | null;
  answeredBy?: string | null;
  answeredAt?: string | null;
  createdAt?: string | null;
  enabled: boolean;
}

export interface INewQuestionRequest {
  articleId: string;
  question: string;
}

export interface IAnswerRequest {
  answer: string;
}

const base = environment.questionsServerUrl + "questions/";

export async function getAll(): Promise<IQuestion[]> {
  try {
    const res = await axios.get(base);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getByArticle(articleId: string): Promise<IQuestion[]> {
  try {
    const res = await axios.get(base + "article/" + articleId);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getMine(): Promise<IQuestion[]> {
  try {
    const res = await axios.get(base + "me");
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getByUser(userId: string): Promise<IQuestion[]> {
  try {
    const res = await axios.get(base + "users/" + userId);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getById(id: string): Promise<IQuestion> {
  try {
    const res = await axios.get(base + id);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function create(payload: INewQuestionRequest): Promise<IQuestion> {
  try {
    const res = await axios.post(base, payload);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function remove(id: string): Promise<void> {
  try {
    await axios.delete(base + id);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function answer(id: string, payload: IAnswerRequest): Promise<IQuestion> {
  try {
    const res = await axios.patch(base + id + "/answer", payload);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteAnswer(id: string): Promise<void> {
  try {
    await axios.delete(base + id + "/answer");
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

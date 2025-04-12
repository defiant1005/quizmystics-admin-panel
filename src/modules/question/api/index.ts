import API from "@/package/config/axios";
import { AxiosResponse } from "axios";
import {
  IQuestionByIdResponse,
  IQuestionParams,
  IQuestionResponse,
} from "@/modules/question/types";

export const apiGetQuestions = (): Promise<
  AxiosResponse<IQuestionResponse>
> => {
  return API.get("question");
};

export const apiGetQuestionById = (
  questionId: number
): Promise<AxiosResponse<IQuestionByIdResponse>> => {
  return API.get(`question/${questionId}`);
};

export const apiCreateQuestion = (params: IQuestionParams) => {
  return API.post("question", params);
};
export const apiEditQuestion = (
  questionId: number,
  params: IQuestionParams
) => {
  return API.put(`question/${questionId}`, params);
};

export const apiRemoveQuestion = (questionId: number) => {
  return API.delete(`question/${questionId}`);
};

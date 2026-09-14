export type ApiSuccess<T> = {
  status: "success";
  message: string;
  data: T;
};

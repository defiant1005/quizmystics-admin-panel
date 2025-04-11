export interface ICategory {
  id: number;
  title: string;
}

export interface ICategoryForm extends Omit<ICategory, "id"> {}

export interface ICategoryParams extends ICategoryForm {}

export interface ICategoryResponse {
  data: ICategory[];
}

export interface ICategoryByIdResponse {
  data: ICategory;
}

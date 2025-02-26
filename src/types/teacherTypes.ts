export interface ITeachersResponse {
  content: ITeacher[];
  paging: IPaging;
}

export interface ITeacher {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  pinfl: string;
  degree: string;
  position: string;
}

export interface IPaging {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}

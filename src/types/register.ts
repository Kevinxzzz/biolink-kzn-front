export interface CompanyRegisterData {
  company: {
    name: string;
    email: string;
    phone: string;
  };
  user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  // role OWNER é atribuída automaticamente pelo backend
}

export interface InviteRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

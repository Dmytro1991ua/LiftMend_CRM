export type GQLErrorDetail = {
  code: string;
  issue: string;
  field?: string;
  value?: string;
  location?: string;
};

export type GQLError = {
  error: {
    id: string;
    status: string;
    name: string;
    message: string;
  };
};

export type ClientErrors = {
  [key: string]: (string | GQLError)[];
};

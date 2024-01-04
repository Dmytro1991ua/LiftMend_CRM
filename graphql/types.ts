export type InventoryClientErrors = {
  [key: string]: string[];
};

export type GQLErrorDetail = {
  code: string;
  issue: string;
  field?: string;
  value?: string;
  location?: string;
};

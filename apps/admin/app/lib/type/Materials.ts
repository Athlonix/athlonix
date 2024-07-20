export type Material = {
  addresses: {
    id_address: number;
    quantity: number;
  }[];
  id: number;
  name: string;
  weight_grams: number | null;
};

export type Address = {
  id: number;
  road: string;
  number: number;
  complement: string | null;
  name: string | null;
};

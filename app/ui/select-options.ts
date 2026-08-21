export type SelectOption = {
  id: number;
  name: string;
};

export type FruitOption = SelectOption & {
  pricePerKg: string;
};

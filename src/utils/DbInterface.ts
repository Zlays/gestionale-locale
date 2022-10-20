interface Imovements {
  id: number | null;
  value: number;
  date: string;
  description: string;
  idProject: number;
}

interface Iproject {
  id: number;
  name: string;
  nominative_value: number;
  date: string;
  current_value: number;
}

export { Imovements, Iproject };

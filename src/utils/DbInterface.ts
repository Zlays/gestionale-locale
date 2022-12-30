interface Imovements {
  id: number | null;
  value: number;
  date: string;
  description: string;
  idProject: number;
  order: number;
}

interface Iproject {
  id: number;
  name: string;
  nominative_value: number;
  start_date: string;
  end_date: string;
  current_value: number;
}

export { Imovements, Iproject };

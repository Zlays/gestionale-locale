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
  date: string;
  total: number;
}

interface Itype {
  id: number;
  name: number;
}

export { Imovements, Iproject, Itype };

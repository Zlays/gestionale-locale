interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  display?: 'block' | 'inline-block';
  whiteSpace?: 'pre-wrap' | 'pre';
  align?: 'right';
  format?: (value: any) => string;
}

export { Column };

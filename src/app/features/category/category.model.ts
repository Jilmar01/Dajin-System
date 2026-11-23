export interface CategoryResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  vidaUtilAnios: number;
  tasaDepreciacionAnual: number;
  creado: string;
}

export interface CategoryRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  vidaUtilAnios: number;
  tasaDepreciacionAnual: number;
}
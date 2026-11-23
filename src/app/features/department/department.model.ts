export interface DepartmentResponse {
    id: number;
    codigo: string;
    nombre: string;
    edificio: string;
    piso: string;
    presupuestoMaximo: number;
    valorActualActivos: number;
    presupuestoDisponible: number;
    creado: string;
}

export interface DepartmentRequest {
    codigo: string;
    nombre: string;
    edificio: string;
    piso: string;
    presupuestoMaximo: number;
    valorActualActivos: number;
    presupuestoDisponible: number;
}
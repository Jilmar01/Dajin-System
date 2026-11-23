import { CategoryResponse } from "../category/category.model";
import { DepartmentResponse } from "../department/department.model";
import { AssetStatus } from "./asset.status";

export interface AssetResponse {
    id: number;
    codigoInventario: string;
    nombre: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    costoAdquisicion: number;
    moneda: string;
    estado: AssetStatus;
    fechaAdquisicion: string;
    finGarantia: string;
    categoria: CategoryResponse;
    departamento: DepartmentResponse;
    creado: string;
}

export interface AssetRequest {
    codigoInventario: string;
    nombre: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    costoAdquisicion: number;
    moneda: string;
    fechaAdquisicion: string;
    finGarantia: string;
    categoriaId: number;
    departamentoId: number;
}

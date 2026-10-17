export type Institucion = 'hospital' | 'clinica' | 'laboratorio' | 'pediatrico';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono?: string;
  correo?: string;
  activo: boolean;
  extra?: Record<string, unknown>;
}

export interface Atencion {
  id: string;
  pacienteId: string;
  fecha: string;
  motivo?: string;
  diagnosticos: Diagnostico[];
  detalle?: Record<string, unknown>;
}

export interface Diagnostico {
  id: string;
  descripcion: string;
  codigo?: string;
  gravedad?: string;
  medicamentos: Medicamento[];
}

export interface Medicamento {
  id: string;
  nombre: string;
  dosis?: string;
  frecuencia?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
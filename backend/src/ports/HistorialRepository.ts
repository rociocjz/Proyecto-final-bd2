import { Paciente, Atencion, Diagnostico, Medicamento } from '../domain/types';

export interface HistorialRepository {
  registrarPaciente(p: Omit<Paciente, 'id' | 'activo'>): Promise<Paciente>;
  buscarPacientes(texto: string): Promise<Paciente[]>;
  obtenerHistorial(pacienteId: string): Promise<{ paciente: Paciente; atenciones: Atencion[] }>;

  registrarAtencion(
    pacienteId: string,
    data: { fecha: string; motivo?: string; detalle?: Record<string, unknown> }
  ): Promise<Atencion>;

  agregarDiagnostico(
    atencionId: string,
    d: Omit<Diagnostico, 'id' | 'medicamentos'>
  ): Promise<Diagnostico>;

  recetarMedicamento(diagnosticoId: string, m: Omit<Medicamento, 'id'>): Promise<Medicamento>;

  darDeBaja(pacienteId: string, motivo: string): Promise<void>;
}
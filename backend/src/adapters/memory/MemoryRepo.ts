import { randomUUID } from 'crypto';
import { HistorialRepository } from '../../ports/HistorialRepository';
import { Paciente, Atencion, Diagnostico, Medicamento } from '../../domain/types';
import { ReglaNegocioError } from '../../domain/rules';

export class MemoryRepo implements HistorialRepository {
  private pacientes: Paciente[] = [];
  private atenciones: Atencion[] = [];

  private getPaciente(id: string): Paciente {
    const p = this.pacientes.find(x => x.id === id);
    if (!p) throw new ReglaNegocioError('Paciente no encontrado');
    return p;
  }

  async registrarPaciente(p: Omit<Paciente, 'id' | 'activo'>): Promise<Paciente> {
    const nuevo: Paciente = { ...p, id: randomUUID(), activo: true };
    this.pacientes.push(nuevo);
    return nuevo;
  }

  async buscarPacientes(texto: string): Promise<Paciente[]> {
    const t = texto.toLowerCase();
    return this.pacientes.filter(p => `${p.nombre} ${p.apellido}`.toLowerCase().includes(t));
  }

  async obtenerHistorial(pacienteId: string) {
    return {
      paciente: this.getPaciente(pacienteId),
      atenciones: this.atenciones.filter(a => a.pacienteId === pacienteId),
    };
  }

  async registrarAtencion(
    pacienteId: string,
    data: { fecha: string; motivo?: string; detalle?: Record<string, unknown> }
  ): Promise<Atencion> {
    const a: Atencion = { id: randomUUID(), pacienteId, ...data, diagnosticos: [] };
    this.atenciones.push(a);
    return a;
  }

  async agregarDiagnostico(
    atencionId: string,
    d: Omit<Diagnostico, 'id' | 'medicamentos'>
  ): Promise<Diagnostico> {
    const a = this.atenciones.find(x => x.id === atencionId);
    if (!a) throw new ReglaNegocioError('Atención no encontrada');
    const nuevo: Diagnostico = { ...d, id: randomUUID(), medicamentos: [] };
    a.diagnosticos.push(nuevo);
    return nuevo;
  }

  async recetarMedicamento(diagnosticoId: string, m: Omit<Medicamento, 'id'>): Promise<Medicamento> {
    for (const a of this.atenciones) {
      const d = a.diagnosticos.find(x => x.id === diagnosticoId);
      if (d) {
        const nuevo: Medicamento = { ...m, id: randomUUID() };
        d.medicamentos.push(nuevo);
        return nuevo;
      }
    }
    throw new ReglaNegocioError('Diagnóstico no encontrado');
  }

  async darDeBaja(pacienteId: string, motivo: string): Promise<void> {
    const p = this.getPaciente(pacienteId);
    p.activo = false;
    p.extra = { ...p.extra, motivoBaja: motivo, fechaBaja: new Date().toISOString() };
  }
}
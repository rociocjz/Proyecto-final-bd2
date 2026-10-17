import { Paciente, Medicamento } from './types';

export class ReglaNegocioError extends Error {}

export function validarPacienteNuevo(p: { nombre: string; apellido: string; fechaNacimiento: string }) {
  if (!p.nombre?.trim() || !p.apellido?.trim()) {
    throw new ReglaNegocioError('Nombre y apellido son obligatorios');
  }
  if (isNaN(Date.parse(p.fechaNacimiento))) {
    throw new ReglaNegocioError('Fecha de nacimiento inválida');
  }
}

export function validarPacienteActivo(p: Paciente) {
  if (!p.activo) {
    throw new ReglaNegocioError('El paciente está dado de baja y no admite nuevos registros');
  }
}

export function validarMedicamento(m: Omit<Medicamento, 'id'>) {
  if (!m.nombre?.trim()) throw new ReglaNegocioError('El medicamento necesita nombre');
  if (m.fechaInicio && m.fechaFin && m.fechaFin < m.fechaInicio) {
    throw new ReglaNegocioError('La fecha fin no puede ser anterior a la fecha inicio');
  }
}
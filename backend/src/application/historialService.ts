import { HistorialRepository } from '../ports/HistorialRepository';
import {
  validarPacienteNuevo, validarPacienteActivo, validarMedicamento, ReglaNegocioError,
} from '../domain/rules';

export class HistorialService {
  constructor(private repo: HistorialRepository) {}

  registrarPaciente(data: any) {
    validarPacienteNuevo(data);
    return this.repo.registrarPaciente(data);
  }

  buscarPacientes(texto: string) {
    return this.repo.buscarPacientes(texto);
  }

  obtenerHistorial(pacienteId: string) {
    return this.repo.obtenerHistorial(pacienteId);
  }

  async registrarAtencion(pacienteId: string, data: any) {
    const { paciente } = await this.repo.obtenerHistorial(pacienteId);
    validarPacienteActivo(paciente);
    return this.repo.registrarAtencion(pacienteId, data);
  }

  agregarDiagnostico(atencionId: string, d: any) {
    if (!d.descripcion?.trim()) throw new ReglaNegocioError('La descripción es obligatoria');
    return this.repo.agregarDiagnostico(atencionId, d);
  }

  recetarMedicamento(diagnosticoId: string, m: any) {
    validarMedicamento(m);
    return this.repo.recetarMedicamento(diagnosticoId, m);
  }

  darDeBaja(pacienteId: string, motivo: string) {
    if (!motivo?.trim()) throw new ReglaNegocioError('El motivo de baja es obligatorio');
    return this.repo.darDeBaja(pacienteId, motivo);
  }
}
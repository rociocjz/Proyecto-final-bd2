import { Router, Request, Response, NextFunction } from 'express';
import { Institucion } from '../domain/types';
import { getRepo } from '../infrastructure/repositoryFactory';
import { HistorialService } from '../application/historialService';

const router = Router();
const INSTITUCIONES = ['hospital', 'clinica', 'laboratorio', 'pediatrico'];

function conServicio(req: Request, res: Response, next: NextFunction) {
  const inst = (req.header('x-institucion') ?? req.query.inst) as Institucion;
  if (!INSTITUCIONES.includes(inst)) {
    return res.status(400).json({ error: 'Header x-institucion inválido' });
  }
  (req as any).service = new HistorialService(getRepo(inst));
  next();
}

router.use(conServicio);

const svc = (req: Request): HistorialService => (req as any).service;

router.post('/pacientes', async (req, res) => {
  res.status(201).json(await svc(req).registrarPaciente(req.body));
});

router.get('/pacientes', async (req, res) => {
  res.json(await svc(req).buscarPacientes(String(req.query.q ?? '')));
});

router.get('/pacientes/:id/historial', async (req, res) => {
  res.json(await svc(req).obtenerHistorial(req.params.id));
});

router.post('/pacientes/:id/atenciones', async (req, res) => {
  res.status(201).json(await svc(req).registrarAtencion(req.params.id, req.body));
});

router.post('/atenciones/:id/diagnosticos', async (req, res) => {
  res.status(201).json(await svc(req).agregarDiagnostico(req.params.id, req.body));
});

router.post('/diagnosticos/:id/medicamentos', async (req, res) => {
  res.status(201).json(await svc(req).recetarMedicamento(req.params.id, req.body));
});

router.post('/pacientes/:id/baja', async (req, res) => {
  await svc(req).darDeBaja(req.params.id, req.body.motivo);
  res.json({ ok: true });
});

export default router;
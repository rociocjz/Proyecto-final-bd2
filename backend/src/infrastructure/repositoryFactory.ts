import { Institucion } from '../domain/types';
import { HistorialRepository } from '../ports/HistorialRepository';
import { MemoryRepo } from '../adapters/memory/MemoryRepo';

const creadores: Record<Institucion, () => HistorialRepository> = {
  hospital:    () => new MemoryRepo(),
  clinica:     () => new MemoryRepo(),
  laboratorio: () => new MemoryRepo(),
  pediatrico:  () => new MemoryRepo(),
};

const cache = new Map<Institucion, HistorialRepository>();

export function getRepo(inst: Institucion): HistorialRepository {
  if (!cache.has(inst)) cache.set(inst, creadores[inst]());
  return cache.get(inst)!;
}
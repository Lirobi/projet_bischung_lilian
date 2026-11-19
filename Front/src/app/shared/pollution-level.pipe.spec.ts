import { PollutionLevelPipe } from './pollution-level.pipe';

describe('PollutionLevelPipe', () => {
  const pipe = new PollutionLevelPipe();

  it('renvoie Faible de 0 à 20', () => {
    expect(pipe.transform(0)).toBe('Faible');
    expect(pipe.transform(20)).toBe('Faible');
  });

  it('renvoie Modérée de 21 à 50', () => {
    expect(pipe.transform(21)).toBe('Modérée');
    expect(pipe.transform(50)).toBe('Modérée');
  });

  it('renvoie Élevée de 51 à 100', () => {
    expect(pipe.transform(51)).toBe('Élevée');
    expect(pipe.transform(100)).toBe('Élevée');
  });

  it('renvoie Dangereuse à partir de 101', () => {
    expect(pipe.transform(101)).toBe('Dangereuse');
    expect(pipe.transform(1000)).toBe('Dangereuse');
  });

  it('gère les décimaux', () => {
    expect(pipe.transform(20.5)).toBe('Modérée');
  });

  it('renvoie une chaîne vide pour une valeur absente ou négative', () => {
    expect(pipe.transform(-1)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(NaN)).toBe('');
  });
});

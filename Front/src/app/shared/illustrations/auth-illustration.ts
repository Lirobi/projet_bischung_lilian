import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Dents d'un engrenage centré en (cx, cy), tracées comme un seul chemin SVG. */
function gearPath(cx: number, cy: number, outer: number, teeth: number): string {
  const inner = outer * 0.8;
  const step = (Math.PI * 2) / teeth;
  const q = step / 4;
  const point = (r: number, a: number) =>
    `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(point(inner, a - q * 1.5), point(outer, a - q * 0.8), point(outer, a + q * 0.8), point(inner, a + q * 1.5));
  }
  return `M${pts.join('L')}Z`;
}

/**
 * Illustration vectorielle à plat (cartes flottantes + engrenages), décorative.
 * Toutes les couleurs viennent des variables CSS : elle suit le thème.
 */
@Component({
  selector: 'app-auth-illustration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-illustration.html',
  styleUrl: './auth-illustration.css',
  host: { 'aria-hidden': 'true' },
})
export class AuthIllustration {
  protected readonly bigGear = gearPath(332, 396, 52, 10);
  protected readonly smallGear = gearPath(70, 76, 34, 8);
}

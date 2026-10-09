import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Pollution } from '../pollution.model';

@Component({
  selector: 'app-pollution-recap',
  imports: [DecimalPipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap implements OnChanges {
  @Input({ required: true }) pollution!: Pollution;
  @Output() readonly restart = new EventEmitter<void>();

  /** Passe à true si l'URL fournie ne pointe pas vers une image chargeable. */
  protected readonly photoBroken = signal(false);

  ngOnChanges(): void {
    this.photoBroken.set(false);
  }

  /** `yyyy-MM-dd` → `dd/MM/yyyy`, sans passer par Date (pas de décalage de fuseau). */
  protected get observedAtFr(): string {
    const [y, m, d] = this.pollution.observedAt.split('-');
    return `${d}/${m}/${y}`;
  }

  protected get mapUrl(): string {
    const { latitude, longitude } = this.pollution;
    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  }
}

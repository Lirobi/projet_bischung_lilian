import { Component, inject, signal } from '@angular/core';
import { PollutionForm } from './pollution/components/pollution-form/pollution-form';
import { PollutionRecap } from './pollution/components/pollution-recap/pollution-recap';
import { Pollution } from './pollution/models/pollution.model';
import { PollutionService } from './pollution/services/pollution.service';

@Component({
  selector: 'app-root',
  imports: [PollutionForm, PollutionRecap],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly pollutionService = inject(PollutionService);

  /** Déclaration validée ; tant qu'elle est nulle, on affiche le formulaire. */
  protected readonly pollution = signal<Pollution | null>(null);

  protected onDeclared(pollution: Pollution): void {
    this.pollutionService.declare(pollution).subscribe((saved) => this.pollution.set(saved));
  }

  protected restart(): void {
    this.pollution.set(null);
  }
}

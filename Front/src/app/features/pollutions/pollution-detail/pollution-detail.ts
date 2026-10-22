import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { POLLUTION_TYPE_LABELS, Pollution } from '../../../core/models/pollution.model';
import { PollutionApi } from '../../../core/services/pollution-api';
import { formatDateFr } from '../../../shared/format';
import { PollutionIllustration } from '../../../shared/illustrations/pollution-illustration';
import { Alert } from '../../../shared/ui/alert';
import { Button } from '../../../shared/ui/button';
import { httpErrorMessage } from '../http-error-message';

/** Détail d'une pollution (/pollutions/:id), avec modification et suppression. */
@Component({
  selector: 'app-pollution-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, PollutionIllustration, Alert, Button],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css',
})
export class PollutionDetail implements OnInit {
  readonly id = input.required<string>();

  private readonly api = inject(PollutionApi);
  private readonly router = inject(Router);

  protected readonly pollution = signal<Pollution | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly deleting = signal(false);
  /** Passe à true si l'URL fournie ne pointe pas vers une image chargeable. */
  protected readonly photoBroken = signal(false);

  protected readonly typeLabel = computed(() => {
    const p = this.pollution();
    return p ? POLLUTION_TYPE_LABELS[p.type] : '';
  });
  protected readonly observedAt = computed(() => {
    const p = this.pollution();
    return p ? formatDateFr(p.observedAt) : '';
  });
  protected readonly mapUrl = computed(() => {
    const p = this.pollution();
    return p
      ? `https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=16/${p.latitude}/${p.longitude}`
      : '';
  });

  ngOnInit(): void {
    this.api.getById(Number(this.id())).subscribe({
      next: (pollution) => this.pollution.set(pollution),
      error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
    });
  }

  protected remove(): void {
    this.error.set(null);
    this.deleting.set(true);
    this.api
      .delete(Number(this.id()))
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/pollutions']),
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }
}

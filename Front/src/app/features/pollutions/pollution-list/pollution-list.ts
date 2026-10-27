import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  POLLUTION_TYPES,
  POLLUTION_TYPE_LABELS,
  Pollution,
  PollutionType,
} from '../../../core/models/pollution.model';
import { PollutionApi } from '../../../core/services/pollution-api';
import { formatDateFr } from '../../../shared/format';
import { Alert } from '../../../shared/ui/alert';
import { Button } from '../../../shared/ui/button';
import { httpErrorMessage } from '../http-error-message';
import { EMPTY_FILTER, PollutionFilter, filterPollutions, isFilterActive } from '../pollution-filter';

/** Liste des pollutions (/pollutions) avec filtres et suppression. */
@Component({
  selector: 'app-pollution-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Alert, Button],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css',
})
export class PollutionList implements OnInit {
  private readonly api = inject(PollutionApi);

  protected readonly types = POLLUTION_TYPES;
  protected readonly typeLabels = POLLUTION_TYPE_LABELS;
  protected readonly formatDate = formatDateFr;

  protected readonly pollutions = signal<Pollution[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Id de la pollution en cours de suppression. */
  protected readonly deletingId = signal<number | null>(null);

  protected readonly filter = signal<PollutionFilter>(EMPTY_FILTER);
  protected readonly filtered = computed(() => filterPollutions(this.pollutions(), this.filter()));
  protected readonly filterActive = computed(() => isFilterActive(this.filter()));

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (list) => {
        this.pollutions.set(list);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected remove(pollution: Pollution): void {
    this.error.set(null);
    this.deletingId.set(pollution.id);
    this.api.delete(pollution.id).subscribe({
      next: () => {
        this.pollutions.update((list) => list.filter((p) => p.id !== pollution.id));
        this.deletingId.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(error));
        this.deletingId.set(null);
      },
    });
  }

  protected setSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.filter.update((f) => ({ ...f, search }));
  }

  protected toggleType(type: PollutionType): void {
    this.filter.update((f) => ({
      ...f,
      types: f.types.includes(type) ? f.types.filter((t) => t !== type) : [...f.types, type],
    }));
  }

  protected setDate(bound: 'from' | 'to', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filter.update((f) => ({ ...f, [bound]: value }));
  }

  protected resetFilter(): void {
    this.filter.set(EMPTY_FILTER);
  }
}

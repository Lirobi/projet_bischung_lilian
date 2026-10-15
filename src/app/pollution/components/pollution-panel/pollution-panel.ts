import { Component } from '@angular/core';

/** Panneau illustré (décoratif) : bandeau sur mobile, colonne de droite dès 768px. */
@Component({
  selector: 'app-pollution-panel',
  templateUrl: './pollution-panel.html',
  styleUrl: './pollution-panel.css',
  host: { 'aria-hidden': 'true' },
})
export class PollutionPanel {}

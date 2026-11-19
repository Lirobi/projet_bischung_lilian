import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PollutionEditor } from './pollution-editor';

describe('PollutionEditor : saisie non enregistrée', () => {
  it('signale une modification du formulaire', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    const fixture = TestBed.createComponent(PollutionEditor);
    await fixture.whenStable();

    expect(fixture.componentInstance.hasUnsavedChanges()).toBe(false);

    const title = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    title.value = 'Déversement';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.hasUnsavedChanges()).toBe(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUp } from './sign-up';

describe('SignUp', () => {
  let fixture: ComponentFixture<SignUp>;
  let el: HTMLElement;

  const fill = async (name: string, value: string) => {
    const input = el.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const submitBtn = () => el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SignUp] }).compileComponents();
    fixture = TestBed.createComponent(SignUp);
    el = fixture.nativeElement;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('has the 6 required fields with the right types', () => {
    const types = ['login', 'password', 'confirmPassword', 'lastName', 'firstName', 'email'].map(
      (n) => el.querySelector<HTMLInputElement>(`input[name="${n}"]`)!.type,
    );
    expect(types).toEqual(['text', 'password', 'password', 'text', 'text', 'email']);
  });

  it('locks submission while the form is empty', () => {
    expect(submitBtn().disabled).toBe(true);
  });

  const fillValid = async () => {
    await fill('login', 'jdoe');
    await fill('lastName', 'Doe');
    await fill('firstName', 'Jean-Luc');
    await fill('email', 'john@doe.fr');
    await fill('password', 'secret123');
    await fill('confirmPassword', 'secret123');
  };

  it.each([
    ['login', 'ab'],
    ['login', 'j doe'],
    ['lastName', 'D'],
    ['lastName', 'Doe3'],
    ['firstName', '   '],
    ['email', 'a@b'],
    ['email', 'john@doe'],
    ['password', 'short1'],
    ['password', 'onlyletters'],
    ['password', '12345678'],
  ])('rejects invalid %s = "%s"', async (name, value) => {
    await fillValid();
    await fill(name, value);
    if (name === 'password') await fill('confirmPassword', value);
    expect(submitBtn().disabled).toBe(true);
  });

  it('shows the error message without changing the form height', async () => {
    const form = el.querySelector('form')!;
    const before = form.getBoundingClientRect().height;
    await fill('login', 'ab');
    expect(el.querySelector('.msg')!.textContent).toContain('3 caractères');
    expect(form.getBoundingClientRect().height).toBe(before);
  });

  it('locks submission when passwords differ or email is invalid', async () => {
    await fill('login', 'jdoe');
    await fill('password', 'secret123');
    await fill('confirmPassword', 'other123');
    await fill('lastName', 'Doe');
    await fill('firstName', 'John');
    await fill('email', 'not-an-email');
    expect(submitBtn().disabled).toBe(true);
    await fill('confirmPassword', 'secret123');
    expect(submitBtn().disabled).toBe(true);
  });

  it('unlocks submission when everything is valid', async () => {
    await fillValid();
    expect(submitBtn().disabled).toBe(false);
  });

  it('shows the welcome screen without changing the card height, then lets the user restart', async () => {
    await fillValid();
    const card = el.querySelector('.card')!;
    const before = card.getBoundingClientRect().height;
    submitBtn().click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('form')!.classList).toContain('done');
    expect(el.querySelector('.success h2')!.textContent).toContain('Jean-Luc');
    expect(card.getBoundingClientRect().height).toBe(before);

    el.querySelector<HTMLButtonElement>('.success button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('form')!.classList).not.toContain('done');
    expect(submitBtn().disabled).toBe(true);
  });
});

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logo } from './shared/ui/logo';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  template: `
    <header>
      <a routerLink="/pollutions" class="home" aria-label="Accueil"><app-logo /></a>
      <nav>
        <a routerLink="/pollutions" routerLinkActive="active">Pollutions</a>
        <a routerLink="/inscription" routerLinkActive="active">Inscription</a>
      </nav>
    </header>
    <main class="anim-page-in">
      <router-outlet />
    </main>
  `,
  styles: `
    header {
      max-width: 62rem;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .home {
      text-decoration: none;
    }
    app-logo {
      font-size: 1.25rem;
    }
    nav {
      display: flex;
      gap: 0.25rem;
    }
    nav a {
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--foreground-muted);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
    }
    nav a:hover {
      background: var(--surface-muted);
    }
    nav a.active {
      color: var(--accent-600);
      background: var(--accent-50);
    }
    main {
      max-width: 62rem;
      margin: 0 auto;
      padding: 0 1rem 2.5rem;
    }
  `,
})
export class App {}

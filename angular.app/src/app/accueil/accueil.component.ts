import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

type PaneType = 'left' | 'right';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class AccueilComponent {

  constructor(private router: Router) {

  }

  @Input() activePane: PaneType = 'left';
  isLeftVisible = true;

  getLogin() {
    return JSON.parse(localStorage.getItem('user')).name;
  }

  logout() {
    console.log('Tentative de déconnexion');

    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

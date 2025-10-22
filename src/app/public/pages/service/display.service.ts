import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  private showHeaderFooter = new BehaviorSubject<boolean>(true);
  showHeaderFooter$ = this.showHeaderFooter.asObservable();

  toggleHeaderFooter(show: boolean) {
    this.showHeaderFooter.next(show);
  }
}
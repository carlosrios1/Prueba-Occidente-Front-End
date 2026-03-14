import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private closeDropdownSource = new Subject<void>();

  // Usar share() para prevenir múltiples ejecuciones
  closeDropdown$ = this.closeDropdownSource.asObservable().pipe(
    share()
  );

  closeAllDropdowns() {
    this.closeDropdownSource.next();
  }
}
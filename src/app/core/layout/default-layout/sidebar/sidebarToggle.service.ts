import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  private readonly STORAGE_KEY = 'sidebarCollapsed';
  private readonly MOBILE_STORAGE_KEY = 'mobileSidebarOpen';

  // Initial state from sessionStorage or false if not exists
  private isCollapsedSubject = new BehaviorSubject<boolean>(
    JSON.parse(sessionStorage.getItem(this.STORAGE_KEY) ?? 'false')
  );

  // Mobile sidebar state
  private isMobileSidebarOpenSubject = new BehaviorSubject<boolean>(false);

  isCollapsed$ = this.isCollapsedSubject.asObservable();
  isMobileSidebarOpen$ = this.isMobileSidebarOpenSubject.asObservable();

  constructor() { }

  toggleSidebar() {
    const newState = !this.isCollapsedSubject.value;
    this.isCollapsedSubject.next(newState);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
  }

  toggleMobileSidebar() {
    const newState = !this.isMobileSidebarOpenSubject.value;
    this.isMobileSidebarOpenSubject.next(newState);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpenSubject.next(false);
  }

  getSidebarState() {
    return this.isCollapsedSubject.value;
  }

  getMobileSidebarState() {
    return this.isMobileSidebarOpenSubject.value;
  }

  setSidebarState(isCollapsed: boolean) {
    this.isCollapsedSubject.next(isCollapsed);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(isCollapsed));
  }

  setMobileSidebarState(isOpen: boolean) {
    this.isMobileSidebarOpenSubject.next(isOpen);
  }
}
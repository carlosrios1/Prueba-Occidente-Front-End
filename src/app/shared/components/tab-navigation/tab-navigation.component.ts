// tab-navigation.component.ts
import {
  Component,
  Input,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Home, Settings, User } from 'lucide-angular';

export interface TabItem {
  id: string;
  label: string;
  icon?: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TabNavigationComponent),
      multi: true,
    },
  ],
  template: `
    <nav
      #navContainer
      [class]="getNavClasses()"
      role="tablist"
      aria-orientation="horizontal"
    >
      <!-- Sliding Background -->
      <div
        #slidingBackground
        class="absolute rounded-md transition-all duration-300 ease-out z-10"
        [style.left.px]="slidePosition.left"
        [style.width.px]="slidePosition.width"
        [style.height.px]="slidePosition.height"
        [style.top.px]="slidePosition.top"
        [style.opacity]="slidePosition.opacity"
      >
        <div [class]="getActiveBackgroundClasses()"></div>
      </div>

      @for (tab of activeTabs; track tab.id) {
        <button
          type="button"
          #tabButton
          [class]="getTabClasses(tab)"
          [attr.id]="'tab-' + tab.id"
          [attr.aria-selected]="selectedTab === tab.id"
          [attr.aria-controls]="'panel-' + tab.id"
          [disabled]="tab.disabled || disabled"
          role="tab"
          (click)="onTabClick(tab)"
        >
          @if (tab.icon) {
            <lucide-icon 
              [img]="tab.icon" 
              [class]="getIconClasses(tab)"
            ></lucide-icon>
          }
          <span [class]="getTextClasses(tab)">{{ tab.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      
      nav::-webkit-scrollbar {
        height: 4px;
      }
      
      nav::-webkit-scrollbar-track {
        background: transparent;
      }
      
      nav::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }
      
      nav::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class TabNavigationComponent
  implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() tabs: TabItem[] = [];
  @Input() fullWidth: boolean = false;
  @Input() activeColor: string = 'bg-neutral-900 dark:bg-neutral-800 ';
  @Input() activeTextColor: string = 'text-white';
  @Input() inactiveTextColor: string = 'text-gray-600 dark:text-neutral-400';
  @Input() hoverTextColor: string = 'hover:text-black';

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  // Default tabs
  private readonly defaultTabs: TabItem[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  activeTabs: TabItem[] = [];
  selectedTab: string = '';
  disabled: boolean = false;

  slidePosition = {
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0
  };

  private initialized = false;
  private resizeObserver?: ResizeObserver;
  private animationFrame?: number;

  // ControlValueAccessor
  private onChange = (value: string) => { };
  private onTouched = () => { };

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setupTabs();
    this.initialized = true;
  }

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.updateSlidePosition();
      this.setupResizeObserver();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs'] && this.initialized) {
      this.setupTabs();
      this.scheduleSlideUpdate();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private setupTabs(): void {
    // Use provided tabs or fallback to defaults
    this.activeTabs = this.tabs?.length > 0 ? this.validateTabs(this.tabs) : [...this.defaultTabs];

    // Set initial selection if none exists
    if (!this.selectedTab && this.activeTabs.length > 0) {
      this.selectedTab = this.activeTabs[0].id;
    }

    // Validate current selection exists in new tabs
    if (this.selectedTab && !this.activeTabs.some(tab => tab.id === this.selectedTab)) {
      this.selectedTab = this.activeTabs[0]?.id || '';
      this.onChange(this.selectedTab);
    }
  }

  private validateTabs(tabs: TabItem[]): TabItem[] {
    return tabs.filter(tab =>
      tab &&
      typeof tab.id === 'string' &&
      tab.id.trim() !== '' &&
      typeof tab.label === 'string' &&
      tab.label.trim() !== ''
    );
  }

  private setupResizeObserver(): void {
    if (!('ResizeObserver' in window) || !this.navContainer) return;

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.scheduleSlideUpdate();
      });

      this.resizeObserver.observe(this.navContainer.nativeElement);
    });

    // Listen for window resize
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => {
        this.scheduleSlideUpdate();
      });
    });
  }

  private scheduleSlideUpdate(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.ngZone.run(() => {
        this.updateSlidePosition();
      });
    });
  }

  private updateSlidePosition(): void {
    if (!this.navContainer || !this.selectedTab) {
      this.slidePosition.opacity = 0;
      return;
    }

    const activeButton = this.navContainer.nativeElement.querySelector(
      `#tab-${this.selectedTab}`
    ) as HTMLButtonElement;

    if (!activeButton) {
      this.slidePosition.opacity = 0;
      return;
    }

    const navRect = this.navContainer.nativeElement.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    // Ensure we have valid dimensions
    if (navRect.width === 0 || buttonRect.width === 0) {
      this.slidePosition.opacity = 0;
      return;
    }

    this.slidePosition = {
      left: buttonRect.left - navRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
      top: buttonRect.top - navRect.top,
      opacity: 1
    };

    this.cdr.detectChanges();
  }

  onTabClick(tab: TabItem): void {
    if (tab.disabled || this.disabled || tab.id === this.selectedTab) return;

    this.selectedTab = tab.id;
    this.onChange(this.selectedTab);
    this.onTouched();

    this.scheduleSlideUpdate();
  }

  // Styling methods
  getNavClasses(): string {
    const baseClasses = 'flex bg-whiteBO dark:bg-neutral-900 rounded-lg space-x-1 overflow-x-auto p-1 relative ';
    const widthClass = this.fullWidth ? 'w-full' : 'w-fit';
    return `${baseClasses} ${widthClass}`;
  }

  getActiveBackgroundClasses(): string {
    return `absolute inset-0 ${this.activeColor} rounded-md shadow-sm`;
  }

  getTabClasses(tab: TabItem): string {
    const baseClasses = this.fullWidth
      ? 'flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md whitespace-nowrap relative transition-colors duration-200 flex-1 min-w-0'
      : 'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md whitespace-nowrap relative transition-colors duration-200';

    if (tab.disabled || this.disabled) {
      return `${baseClasses} text-gray-400 dark:text-neutral-400 cursor-not-allowed opacity-50`;
    }

    if (this.selectedTab === tab.id) {
      return `${baseClasses} ${this.activeTextColor} relative z-20`;
    }

    return `${baseClasses} ${this.inactiveTextColor} ${this.hoverTextColor} cursor-pointer`;
  }

  getIconClasses(tab: TabItem): string {
    const baseClasses = 'w-4 h-4 flex-shrink-0';

    if (this.selectedTab === tab.id) {
      return `${baseClasses}`;
    }

    return `${baseClasses} opacity-70`;
  }

  getTextClasses(tab: TabItem): string {
    const baseClasses = 'truncate hidden lg:inline';

    if (this.selectedTab === tab.id) {
      return `${baseClasses} font-semibold`;
    }

    return `${baseClasses}`;
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    if (value !== this.selectedTab) {
      this.selectedTab = value || '';

      // Validate the value exists in current tabs
      if (this.selectedTab && this.activeTabs.length > 0) {
        const tabExists = this.activeTabs.some(tab => tab.id === this.selectedTab);
        if (!tabExists) {
          this.selectedTab = this.activeTabs[0].id;
        }
      }

      this.scheduleSlideUpdate();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
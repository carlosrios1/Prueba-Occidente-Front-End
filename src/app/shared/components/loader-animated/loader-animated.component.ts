import { Component } from '@angular/core';
import { FILTROS_ANIMATIONS } from '../../../features/campaigns/features/new/sections/audiencia/utils/filtros.animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader-animated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-animated.component.html',
  styleUrl: './loader-animated.component.css',
  animations: FILTROS_ANIMATIONS
})
export class LoaderAnimatedComponent {

}

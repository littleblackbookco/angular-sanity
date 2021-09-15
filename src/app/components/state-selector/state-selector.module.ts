import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateSelectorComponent } from './state-selector.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StateSelectorComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [StateSelectorComponent],
})
export class StateSelectorModule {}

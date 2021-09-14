import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPreviewComponent } from './item-preview.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ItemPreviewComponent],
  imports: [CommonModule, RouterModule],
  exports: [ItemPreviewComponent],
})
export class ItemPreviewModule {}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
})
export class ItemPreviewComponent implements OnInit {
  @Input() item!: {
    animated?: boolean;
    height?: number;
    width?: number;
    route?: string;
    caption: string;
    url: string;
    title?: string;
    quantity?: number;
  };

  constructor() {}

  ngOnInit(): void {}
}

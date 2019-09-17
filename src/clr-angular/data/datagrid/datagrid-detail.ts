/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, HostListener, Renderer2, ElementRef } from '@angular/core';
import { DetailService } from './providers/detail.service';
import { TableSizeService } from './providers/table-size.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';

@Component({
  selector: 'clr-dg-detail',
  host: {
    '[class.datagrid-detail-pane]': 'true',
    '[style.height.px]': 'detailPaneHeight',
  },
  // We put the *ngIf on the clrFocusTrap so it doesn't always exist on the page
  // have to test for presence of header for aria-describedby because it was causing unit tests to crash
  template: `
    <div clrFocusTrap class="datagrid-detail-pane-content" *ngIf="detailService.isOpen" role="dialog" 
         [id]="detailService.id" aria-modal="true" [attr.aria-describedby]="header ? header.titleId : ''">
      <div class="clr-sr-only">{{commonStrings.keys.detailPaneStart}}</div>
      <ng-content></ng-content>
      <div class="clr-sr-only">{{commonStrings.keys.detailPaneEnd}}</div>
    </div>
    `,
})
export class ClrDatagridDetail {
  @ContentChild(ClrDatagridDetailHeader, { static: false })
  public header: ClrDatagridDetailHeader;

  constructor(
    public detailService: DetailService,
    public commonStrings: ClrCommonStringsService,
    private tableSizeService: TableSizeService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostListener('document:keyup.esc')
  closeCheck(): void {
    this.detailService.close();
  }

  private _detailPaneHeight: number;

  // Safari doesn't know how to size the contents of the detail pane if the height is not set
  get detailPaneHeight() {
    if (typeof this._detailPaneHeight === 'undefined') {
      // this.renderer.setStyle(this.el.nativeElement, 'height', datagridHeight);
      this._detailPaneHeight = this.tableSizeService.tableHeight + this.tableSizeService.tableFooterHeight;
    }
    return this._detailPaneHeight;
  }
}

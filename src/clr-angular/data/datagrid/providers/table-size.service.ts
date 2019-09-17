/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
@Injectable()
export class TableSizeService {
  private _tableRef: HTMLElement;

  public get tableRef(): HTMLElement {
    return this._tableRef;
  }

  public set tableRef(element: HTMLElement) {
    this._tableRef = element;
  }

  public get tableHost(): HTMLElement {
    let datagridWrapper, datagridEl, datagridHost;
    if (!this.tableRef) {
      return;
    }
    datagridWrapper = this.tableRef.parentElement;
    datagridEl = datagridWrapper && datagridWrapper.parentElement;
    datagridHost = datagridEl && datagridEl.parentElement;

    if (!datagridHost) {
      return;
    }
    return datagridHost;
  }

  public get tableFooterRef() {
    if (!this.tableRef || !this.tableHost) {
      return;
    }
    return this.tableHost.querySelector('.datagrid-footer');
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public set table(table: ElementRef) {
    if (this.tableDomExists(table.nativeElement)) {
      this.tableRef = table.nativeElement.querySelector('.datagrid-table');
    }
  }

  tableDomExists(tableHTML: HTMLElement): boolean {
    return !!(isPlatformBrowser(this.platformId) && tableHTML);
  }

  public get tableHeight(): number {
    return this.tableDomExists(this.tableRef) ? this.tableRef.clientHeight : 0;
  }

  public get tableFooterHeight(): number {
    const borderNudge = 2;
    return this.tableFooterRef ? this.tableFooterRef.clientHeight + borderNudge : 0;
  }

  // Used when resizing columns to show the column border being dragged.
  getColumnDragHeight(): string {
    if (!this.tableRef) {
      return;
    }
    return `${this.tableHeight}px`;
  }
}

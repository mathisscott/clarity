import { LitElement } from 'lit-element';
import { CdaNav } from '../nav/nav.element.js';
export declare class CdaNavGroup extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    _parentGroup: CdaNavGroup | CdaNav | null;
    expanded: 'true' | 'false' | null;
    ariaHidden: 'true' | 'false' | null;
    private get isExpanded();
    private _navGroupBtnId;
    constructor();
    get navGroupBtn(): Element | null;
    childItems: any;
    updated(props: Map<string, any>): void;
    render(): import("lit-element").TemplateResult;
    toggle(): void;
    private emit;
}

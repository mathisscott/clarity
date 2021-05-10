import { LitElement } from 'lit-element';
export declare class CdaNav extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    navTopButton: any;
    navigableItems: any;
    firstUpdated(props: Map<string, any>): void;
    disconnectedCallback(): void;
    expanded: boolean;
    render(): import("lit-element").TemplateResult;
    private setUpChildren;
    private toggle;
    private emit;
    private setupKeyboardNavigation;
    private tearDownKeyboardNavigation;
    get currentFocused(): Element | null;
    get currentFocusedType(): "cda-nav" | "cda-nav-group" | "cda-nav-item" | "";
    findFocusedItemType(item: Element | null): "cda-nav" | "cda-nav-group" | "cda-nav-item" | "";
    get currentFocusedIndex(): number;
    private handleKeyEvents;
}

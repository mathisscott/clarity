export declare class ClrIconAlias extends CwcIcon {
}

export declare class CwcButton extends LitElement {
    render(): import("lit-element").TemplateResult;
    static readonly styles: import("lit-element").CSSResult;
}

export declare class CwcIcon extends IconMixinClass {
    dir: string;
    flip: string;
    id: string;
    shape: string;
    size: string;
    title: string;
    connectedCallback(): void;
    firstUpdated(): void;
    render(): import("lit-element").TemplateResult;
    updateSVGAttributes(): Promise<void>;
    updated(changedProperties: any): void;
    static readonly styles: import("lit-element").CSSResult;
}

export declare class CwcTestDropdown extends LitElement {
    open: boolean;
    title: string;
    render(): import("lit-element").TemplateResult;
    toggle(): void;
    static readonly styles: import("lit-element").CSSResult;
}

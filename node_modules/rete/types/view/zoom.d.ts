export declare class Zoom {
    el: HTMLElement;
    intensity: number;
    onzoom: Function;
    onlock: Function;
    previous: {
        cx: number;
        cy: number;
        distance: number;
    } | null;
    pointers: PointerEvent[];
    constructor(container: HTMLElement, el: HTMLElement, intensity: number, onzoom: Function, onlock: Function);
    wheel(e: WheelEvent): void;
    touches(): {
        cx: number;
        cy: number;
        distance: number;
    };
    down(e: PointerEvent): void;
    move(e: PointerEvent): void;
    end(e: PointerEvent): void;
    dblclick(e: MouseEvent): void;
}

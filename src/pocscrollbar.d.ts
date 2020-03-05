export interface PocScrollbarOptions {
    disableInteractionWithScrollbars?: boolean;
    disableTouchScrollingOnContainer?: boolean;
    useMutationObserver?: boolean;
    checkInterval?: number;
    disableXScrolling?: boolean;
    disableYScrolling?: boolean;
    xElementStyles?: Record<string, string>;
    yElementStyles?: Record<string, string>;
    xElementClass?: string | string[];
    yElementClass?: string | string[];
    xMinSize?: number;
    yMinSize?: number;
    wheelDeltaSize?: number;
}

type ScrollChangeEventTypes = "scrollTopChanged" | "scrollLeftChanged";

interface BaseEvent {
    timestamp: Readonly<number>;
    defaultPrevented: Readonly<boolean>;
    preventDefault: () => void;
    propagationStopped: Readonly<boolean>;
    stopPropagation: () => void;
}

export interface ScrollChangedEvent extends BaseEvent {
    type: ScrollChangeEventTypes;
    target: HTMLElement;
    srcElement: HTMLElement;
    delta: number;
    oldValue: number;
    newValue: number
}

export interface ScrollView {
    constructor(parentInstance: PocScrollbar, options: PocScrollbarOptions);
    scrollTopUpdated(newScrollTop: number): void;
    scrollLeftUpdated(newScrollTop: number): void;
    parentUpdated(): void;
    getScrollElement(forX: boolean): HTMLElement;
    destroy(): void;
}

export default class PocScrollbar {
    constructor(element: HTMLElement, options?: PocScrollbarOptions);
    addEventListener(eventName: ScrollChangeEventTypes, callBack: (event?: ScrollChangedEvent) => any): void;
    removeEventListener(eventName: ScrollChangeEventTypes, callBack: (event?: ScrollChangedEvent) => any): void;
    scrollTop(scrollTop?: number): number;
    scrollLeft(scrollLeft?: number): number;
    destroy(): void;

    static ScrollView: ScrollView;
}

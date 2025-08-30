import {ComponentType, DOMAttributes, ForwardRefExoticComponent, MouseEvent, PointerEvent, PropsWithoutRef, RefAttributes, TouchEvent, WheelEvent} from 'react';
import ComponentStyle from './models/ComponentStyle';

export type UseGestureEvent = MouseEvent | TouchEvent | WheelEvent | PointerEvent;

export type Vector2 = [number, number];

export type FullGestureState<T extends string> = {
  _gesture: T;
  _active: boolean;
  _initial: Vector2;
  _movement: Vector2;
  _lastOffset: Vector2;
  _bounds: [Vector2, Vector2];
  _lastEventType?: string;

  event?: UseGestureEvent;
  currentTarget?: EventTarget;
  pointerId?: number;
  timeStamp?: number;
  startTime?: number;
  elapsedTime?: number;
  values: Vector2;
  velocities: Vector2;
  delta: Vector2;
  movement: Vector2;
  offset: Vector2;
  lastOffset: Vector2;
  xy: Vector2;
  vxvy: Vector2;
  velocity: number;
  distance: number;
  direction: Vector2;
  initial: Vector2;
  previous: Vector2;
  first: boolean;
  last: boolean;
  active: boolean;
  axis?: 'x' | 'y';
  _intentional: [FalseOrNumber, FalseOrNumber];
  _blocked: boolean;
  memo?: any;
  cancel: () => void;
  canceled: boolean;
  args?: any;
};

export type DragState = FullGestureState<'drag'> & {
  down: boolean;
  dragging: boolean;
  tap: boolean;
  _isTap?: boolean;
  _delayedEvent?: boolean;
  swipe: Vector2;
};

export type MoveState = FullGestureState<'move'> & {
  hovering: boolean;
};

export type WheelState = FullGestureState<'wheel'>;

export type ScrollState = FullGestureState<'scroll'>;

export type PinchState = FullGestureState<'pinch'> & DistanceAngle;

export type StateFromGesture<T extends string> = T extends 'drag'
  ? DragState
  : T extends 'move'
  ? MoveState
  : T extends 'wheel'
  ? WheelState
  : T extends 'scroll'
  ? ScrollState
  : T extends 'pinch'
  ? PinchState
  : FullGestureState<T>;

export type CommonGestureState = Omit<FullGestureState<any>, '_gesture'>;

export type Coordinates = {
  axis?: 'x' | 'y';
  xy: Vector2;
  vxvy: Vector2;
  velocity: number;
  distance: number;
};

export type DistanceAngle = {
  da: Vector2;
  vdva: Vector2;
  origin?: Vector2;
  turns: number;
};

export type State = {
  shared: SharedGestureState;
  drag: DragState;
  pinch: PinchState;
  wheel: WheelState;
  move: MoveState;
  scroll: ScrollState;
};

export type Handler<T extends string> = (
  state: StateFromGesture<T>
) => any | void;

export type InternalConfig = {
  drag?: any;
  move?: any;
  [key: string]: any | undefined;
};

export type StateKey = keyof Omit<State, 'shared'>;
// export type StateKey = Extract<keyof InternalConfig, string>;

export type CoordinatesKey = 'drag' | 'move';

export type IngKey = 'dragging' | 'moving' | 'scrolling' | 'wheeling' | 'pinching';

export type FalseOrNumber = false | number;

export type SharedGestureState = {
  [key in IngKey]?: boolean;
} & {
  touches: number;
  down: boolean;
  buttons: number;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
};

export type GestureState<T extends StateKey> = StateFromGesture<T>;

export type PartialGestureState<T extends StateKey> = Partial<GestureState<T>>;

export type HookReturnType<Config> = any;

export type UseDragConfig = {
  domTarget?: EventTarget;
  eventOptions?: AddEventListenerOptions;
  window?: Window;
  [key: string]: any;
};

export type UseMoveConfig = {
  domTarget?: EventTarget;
  eventOptions?: AddEventListenerOptions;
  window?: Window;
  [key: string]: any;
};

/**
 * The `attrs` prop, which is an array of attribute objects or functions that
 * return attribute objects.
 */
export type Attrs = (Record<string, any> | ((props: any) => Record<string, any>))[];

/**
 * A `RuleSet` is an array of rules that can be strings, objects, or functions.
 */
export type RuleSet = any[];

/**
 * A stringifier is a function that takes a CSS rule and returns a string.
 * It can also have a hash property for caching.
 */
export type Stringifier = {
  (css: string, selector?: string, parent?: string, componentId?: string): string;
  hash?: string;
};

/**
 * The `target` of a styled component, which can be an HTML tag name or a React component.
 */
export type Target = string | ComponentType<any> | StyledComponentWrapper<any, any>;

/**
 * A generic function type.
 */
export type Fn = (...args: any[]) => any;

/**
 * A map of native React event handlers.
 */
export type NativeHandlersPartial = Partial<DOMAttributes<EventTarget>>;

export type ReactEventHandlers = Partial<DOMAttributes<EventTarget>>;

/**
 * A union of all possible React event handler keys.
 */
export type ReactEventHandlerKey = keyof DOMAttributes<EventTarget>;

/**
 * A map of gesture handlers.
 */
export type InternalHandlers = {
  [key: string]: Handler<any>;
};

/**
 * Generic options for gestures.
 */
export type GenericOptions = {
  domTarget?: EventTarget;
  eventOptions?: { passive?: boolean; capture?: boolean; pointer?: boolean };
  window?: Window;
  enabled?: boolean;
  [key: string]: any;
};

/**
 * An interface for a gesture recognizer.
 */
export interface Recognizer {
  addBindings(): void;
}

/**
 * An interface for a gesture recognizer class constructor.
 */
export interface RecognizerClass {
  new (controller: any, args: any[]): Recognizer;
}

/**
 * An array of recognizer classes.
 */
export type RecognizerClasses = RecognizerClass[];

export interface StyledComponentWrapperProperties {
  attrs: Attrs;
  componentStyle: ComponentStyle;
  displayName: string;
  foldedComponentIds: string[];
  target: Target;
  shouldForwardProp?: (prop: string, isValidAttr: (prop: string) => boolean) => boolean;
  styledComponentId: string;
  warnTooManyClasses?: (className: string) => void;
  defaultProps?: any;
  withComponent(tag: Target): StyledComponentWrapper<any, any>;
}


export type StyledComponentWrapper<Config, Instance> = ForwardRefExoticComponent<PropsWithoutRef<Config> & RefAttributes<Instance>> &
    StyledComponentWrapperProperties;

export type SheetOptions = {
  isServer: boolean;
  useCSSOMInjection: boolean;
  target?: HTMLElement;
};

export interface Sheet {
  options: SheetOptions;
  gs: { [key: string]: number };
  names: Map<string, Set<string>>;
  tag?: GroupedTag;
  reconstructWithOptions(options: Partial<SheetOptions>): Sheet;
  allocateGSInstance(id: string): number;
  getTag(): GroupedTag;
  hasNameForId(id: string, name: string): boolean;
  registerName(id: string, name: string): void;
  insertRules(id: string, name: string, rules: string[]): void;
  clearNames(id: string): void;
  clearRules(id: string): void;
  clearTag(): void;
  toString(): string;
}

export interface Tag {
  insertRule(index: number, rule: string): boolean;
  deleteRule(index: number): void;
  getRule(index: number): string;
}

export interface GroupedTag {
  length: number;
  tag: Tag;

  indexOfGroup(group: number): number;
  insertRules(group: number, rules: string[]): void;
  clearGroup(group: number): void;
  getGroup(group: number): string;
}
import validAttr from '@emotion/is-prop-valid';
import React, { createElement, useContext, useDebugValue } from 'react';
import hoist from 'hoist-non-react-statics';
import merge from '../utils/mixinDeep';
import ComponentStyle from './ComponentStyle';
import createWarnTooManyClasses from '../utils/createWarnTooManyClasses';
import { checkDynamicCreation } from '../utils/checkDynamicCreation';
import determineTheme from '../utils/determineTheme';
import escape from '../utils/escape';
import generateDisplayName from '../utils/generateDisplayName';
import getComponentName from '../utils/getComponentName';
import generateComponentId from '../utils/generateComponentId';
import isFunction from '../utils/isFunction';
import isStyledComponent from '../utils/isStyledComponent';
import isTag from '../utils/isTag';
import joinStrings from '../utils/joinStrings';
import { ThemeContext } from './ThemeProvider';
import { useStyleSheet, useStylis } from './StyleSheetManager';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../utils/empties';


import { Attrs, RuleSet, StyledComponentWrapper, Target } from '../types';

const identifiers: { [key: string]: number } = {};

/* We depend on components having unique IDs */
function generateId(displayName: string, parentComponentId: string | undefined) {
  const name = escape(displayName);
  // Ensure that no displayName can lead to duplicate componentIds
  identifiers[name] = (identifiers[name] || 0) + 1;

  const componentId = `${name}-${generateComponentId(name + identifiers[name])}`;
  return parentComponentId ? `${parentComponentId}-${componentId}` : componentId;
}

function useResolvedAttrs<Config>(theme: any = EMPTY_OBJECT, props: Config, attrs: Attrs) {
  // NOTE: can't memoize this
  // returns [context, resolvedAttrs]
  // where resolvedAttrs is only the things injected by the attrs themselves
  const context: { [key: string]: any } = { ...props, theme };
  const resolvedAttrs: { [key: string]: any } = {};

  attrs.forEach(attrDef => {
    let resolvedAttrDef: Record<string, any> = attrDef;
    let key: string;

    if (isFunction(resolvedAttrDef)) {
      resolvedAttrDef = resolvedAttrDef(context);
    }

    /* eslint-disable guard-for-in */
    for (key in resolvedAttrDef) {
      context[key] = resolvedAttrs[key] =
        key === 'className'
          ? joinStrings(resolvedAttrs[key], resolvedAttrDef[key])
          : resolvedAttrDef[key];
    }
    /* eslint-enable guard-for-in */
  });

  return [context, resolvedAttrs];
}

function useInjectedStyle<T extends object>(
  componentStyle: ComponentStyle,
  hasAttrs: boolean,
  resolvedAttrs: T,
  warnTooManyClasses?: (className: string) => void
) {
  const styleSheet = useStyleSheet();
  const stylis = useStylis();

  // statically styled-components don't need to build an execution context object,
  // and shouldn't be increasing the number of class names
  const isStatic = componentStyle.isStatic && !hasAttrs;

  const className = isStatic
    ? componentStyle.generateAndInjectStyles(EMPTY_OBJECT, styleSheet, stylis)
    : componentStyle.generateAndInjectStyles(resolvedAttrs, styleSheet, stylis);

  useDebugValue(className);

  if (process.env.NODE_ENV !== 'production' && !isStatic && warnTooManyClasses) {
    warnTooManyClasses(className);
  }

  return className;
}

function useStyledComponentImpl<Config extends object, Instance>(
  forwardedComponent: StyledComponentWrapper<Config, Instance>,
  props: Config & { [key: string]: any },
  forwardedRef: React.Ref<Instance>
) {
  const {
    attrs: componentAttrs,
    componentStyle,
    defaultProps,
    foldedComponentIds,
    shouldForwardProp,
    styledComponentId,
    target,
  } = forwardedComponent;

  useDebugValue(styledComponentId);

  // NOTE: the non-hooks version only subscribes to this when !componentStyle.isStatic,
  // but that'd be against the rules-of-hooks. We could be naughty and do it anyway as it
  // should be an immutable value, but behave for now.
  const theme = determineTheme(props, useContext(ThemeContext), defaultProps);

  const [context, attrs] = useResolvedAttrs(theme || EMPTY_OBJECT, props, componentAttrs);

  const generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    context,
    process.env.NODE_ENV !== 'production' ? forwardedComponent.warnTooManyClasses : undefined
  );

  const refToForward = forwardedRef;

  const elementToBeCreated: Target = attrs.$as || props.$as || attrs.as || props.as || target;

  const isTargetTag = isTag(elementToBeCreated);
  const computedProps = attrs !== props ? { ...props, ...attrs } : props;
  const propFilterFn = shouldForwardProp || (isTargetTag && validAttr);
  const propsForElement: { [key: string]: any } = {};

  // eslint-disable-next-line guard-for-in
  for (const key in computedProps) {
    if (key[0] === '$' || key === 'as') continue;
    else if (key === 'forwardedAs') {
      propsForElement.as = computedProps[key];
    } else if (!propFilterFn || propFilterFn(key, validAttr)) {
      // Don't pass through non HTML tags through to HTML elements
      propsForElement[key] = computedProps[key];
    }
  }

  if (props.style && attrs.style !== props.style) {
    propsForElement.style = { ...props.style, ...attrs.style };
  }

  propsForElement.className = joinStrings(
    ...foldedComponentIds,
    styledComponentId,
    generatedClassName !== styledComponentId ? generatedClassName : null,
    props.className,
    attrs.className
  );

  propsForElement.ref = refToForward;

  return createElement(elementToBeCreated, propsForElement);
}

interface StyledComponentOptions {
  attrs?: Attrs;
  displayName?: string;
  componentId?: string;
  parentComponentId?: string;
  shouldForwardProp?: (prop: string, isValidAttr: (prop: string) => boolean) => boolean;
}

export default function createStyledComponent(
  target: Target,
  options: StyledComponentOptions = {},
  rules: RuleSet
) {
  const isTargetStyledComp = isStyledComponent(target);
  const isCompositeComponent = !isTag(target);

  const displayName = options.displayName || generateDisplayName(target);
  const { attrs = EMPTY_ARRAY } = options;

  const componentId = options.componentId || generateId(displayName, options.parentComponentId);

  const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(displayName)}-${componentId}`
      : componentId;

  // fold the underlying StyledComponent attrs up (implicit extend)
  const finalAttrs =
    // $FlowFixMe
    isTargetStyledComp && target.attrs
      ? Array.prototype.concat(target.attrs, attrs).filter(Boolean)
      : attrs;

  // eslint-disable-next-line prefer-destructuring
  let shouldForwardProp = options.shouldForwardProp;

  if (isTargetStyledComp && target.shouldForwardProp) {
    if (shouldForwardProp) {
      // compose nested shouldForwardProp calls
      const oldShouldForwardProp = shouldForwardProp;
      shouldForwardProp = (prop, filterFn) =>
      (target.shouldForwardProp ? target.shouldForwardProp(prop, filterFn) : true) && oldShouldForwardProp(prop, filterFn);
    } else {
      // eslint-disable-next-line prefer-destructuring
      shouldForwardProp = target.shouldForwardProp;
    }
  }

  const componentStyle = new ComponentStyle(
    isTargetStyledComp
      ? // fold the underlying StyledComponent rules up (implicit extend)
        // $FlowFixMe
        target.componentStyle.rules.concat(rules)
      : rules,
    styledComponentId
  );

  /**
   * forwardRef creates a new interim component, which we'll take advantage of
   * instead of extending ParentComponent to create _another_ interim class
   */
  let WrappedStyledComponent: StyledComponentWrapper<any, any>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const forwardRef = (props: any, ref: React.Ref<any>) =>
    useStyledComponentImpl(WrappedStyledComponent, props, ref);

  forwardRef.displayName = displayName;

  // $FlowFixMe this is a forced cast to merge it StyledComponentWrapperProperties
  WrappedStyledComponent = React.forwardRef(forwardRef) as StyledComponentWrapper<any, any>;

  WrappedStyledComponent.attrs = finalAttrs;
  WrappedStyledComponent.componentStyle = componentStyle;
  WrappedStyledComponent.displayName = displayName;
  WrappedStyledComponent.shouldForwardProp = shouldForwardProp;

  // this static is used to preserve the cascade of static classes for component selector
  // purposes; this is especially important with usage of the css prop
  WrappedStyledComponent.foldedComponentIds = isTargetStyledComp
    ? // $FlowFixMe
      Array.prototype.concat(target.foldedComponentIds, target.styledComponentId)
    : EMPTY_ARRAY;

  WrappedStyledComponent.styledComponentId = styledComponentId;

  // fold the underlying StyledComponent target up since we folded the styles
  WrappedStyledComponent.target = isTargetStyledComp
    ? // $FlowFixMe
      target.target
    : target;

  // $FlowFixMe
  WrappedStyledComponent.withComponent = function withComponent(tag: Target) {
    const { componentId: previousComponentId, ...optionsToCopy } = options;

    const newComponentId =
      previousComponentId &&
      `${previousComponentId}-${isTag(tag) ? tag : escape(getComponentName(tag))}`;

    const newOptions = {
      ...optionsToCopy,
      attrs: finalAttrs,
      componentId: newComponentId,
    };

    return createStyledComponent(tag, newOptions, rules);
  };

  // $FlowFixMe
  Object.defineProperty(WrappedStyledComponent, 'defaultProps', {
    get() {
      return this._foldedDefaultProps;
    },

    set(obj) {
      // $FlowFixMe
      this._foldedDefaultProps = isTargetStyledComp ? merge({}, target.defaultProps, obj) : obj;
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    checkDynamicCreation(displayName, styledComponentId);

    WrappedStyledComponent.warnTooManyClasses = createWarnTooManyClasses(
      displayName,
      styledComponentId
    );
  }

  // $FlowFixMe
  WrappedStyledComponent.toString = () => `.${WrappedStyledComponent.styledComponentId}`;

  if (isCompositeComponent) {
    hoist(WrappedStyledComponent, target as any, {
      // all SC-specific things should not be hoisted
      attrs: true,
      componentStyle: true,
      displayName: true,
      foldedComponentIds: true,
      shouldForwardProp: true,
      self: true,
      styledComponentId: true,
      target: true,
      withComponent: true,
    });
  }

  return WrappedStyledComponent;
}

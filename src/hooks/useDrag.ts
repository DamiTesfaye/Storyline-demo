import React from 'react'
import useRecognizers from './useRecognizers'
import DragRecognizer from '../recognizers/DragRecognizer'
import { Handler, InternalConfig, HookReturnType, UseDragConfig } from '../types'
import { getInternalGenericOptions, getInternalDragOptions } from '../utils/config'

/**
 * @public
 *
 * Drag hook.
 *
 * @param {Handler<'drag'>} handler - the function fired every time the drag gesture updates
 * @param {(Config | {})} [config={}] - the config object including generic options and drag options
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
// export function useDrag<Config extends UseDragConfig>(
//   handler: Handler<'drag'>,
//   config: Config | {} = {}
// ): (...args: any[]) => HookReturnType<Config> {
//   const { domTarget, eventOptions, window, ...drag } = config as UseDragConfig
//
//   /**
//    * TODO: at the moment we recompute the config object at every render
//    * this could probably be optimized
//    */
//   const mergedConfig: InternalConfig = {
//     ...getInternalGenericOptions({
//       domTarget,
//       eventOptions,
//       window,
//     }),
//     drag: getInternalDragOptions(drag),
//   }
//
//   return useRecognizers<Config>({ drag: handler }, [DragRecognizer], mergedConfig)
// }

export function useDrag<Config extends UseDragConfig>(
    handler: Handler<'drag'>,
    config: Config | {} = {}
): (...args: any[]) => HookReturnType<Config> {
  const { domTarget, eventOptions, window, ...drag } = config as UseDragConfig

  const mergedConfig: InternalConfig = React.useMemo(
      () => ({
        ...getInternalGenericOptions({
          domTarget,
          eventOptions,
          window,
        }),
        drag: getInternalDragOptions(drag),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [domTarget, eventOptions, window, JSON.stringify(drag)]
  )

  return useRecognizers<Config>({ drag: handler }, [DragRecognizer], mergedConfig)
}

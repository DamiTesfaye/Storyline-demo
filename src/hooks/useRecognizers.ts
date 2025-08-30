/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import Controller from '../Controller'
import {
  InternalConfig,
  HookReturnType,
  InternalHandlers,
  RecognizerClasses,
  GenericOptions,
  NativeHandlersPartial,
  ReactEventHandlerKey,
  Fn,
} from '../types'
/**
 * @private
 *
 * Utility hook called by all gesture hooks and that will be responsible for the internals.
 *
 * @param {Partial<InternalHandlers>} handlers
 * @param {RecognizerClasses} classes
 * @param {InternalConfig} config
 * @param {NativeHandlersPartial} nativeHandlers - native handlers such as onClick, onMouseDown, etc.
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
export default function useRecognizers<Config extends Partial<GenericOptions>>(
  handlers: Partial<InternalHandlers>,
  classes: RecognizerClasses,
  config: InternalConfig,
  nativeHandlers?: NativeHandlersPartial
): (...args: any[]) => HookReturnType<Config> {
  // The gesture controller keeping track of all gesture states
  const controller = React.useMemo(() => {
    const current = new Controller()

    /**
     * The bind function will create gesture recognizers and return the right
     * bind object depending on whether `domTarget` was specified in the config object.
     */
    const bind = (...args: any[]) => {
      current.resetBindings()
      for (let RecognizerClass of classes) {
        new RecognizerClass(current, args).addBindings()
      }

      // we also add event bindings for native handlers
      if (controller.nativeRefs) {
        for (const eventName of Object.keys(controller.nativeRefs) as ReactEventHandlerKey[]) {
          const handler = controller.nativeRefs[eventName];
          if (handler) {
            current.addBindings(
              eventName,
              // The cast is needed because the controller's `addBindings` is likely not typed
              // to handle all the specific event types from native handlers.
              handler as (event: any) => void
            );
          }
        }
      }

      return current.getBind() as HookReturnType<Config>
    }

    return { nativeRefs: nativeHandlers, current, bind }
  }, [])

  // We reassign the config and handlers to the controller on every render.
  controller.current!.config = config
  controller.current!.handlers = handlers
  // We assign nativeHandlers, otherwise they won't be refreshed on the next render.
  controller.nativeRefs = nativeHandlers

  // Run controller clean functions on unmount.
  React.useEffect(() => controller.current!.clean, [])

  return controller.bind
}

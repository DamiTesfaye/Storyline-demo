import { observable, runInAction } from "mobx"
import React from "react"

import { isPlainObject } from "./utils"

export function useAsObservableSourceInternal<TSource>(
    current: TSource | undefined,
    usedByLocalStore: boolean
): TSource | undefined {
    const culprit = usedByLocalStore ? "useLocalStore" : "useAsObservableSource"
    if (__DEV__ && usedByLocalStore) {
        const [initialSource] = React.useState(current)
        if (
            (initialSource !== undefined && current === undefined) ||
            (initialSource === undefined && current !== undefined)
        ) {
            throw new Error(`make sure you never pass \`undefined\` to ${culprit}`)
        }
    }
    if (usedByLocalStore && current === undefined) {
        return undefined
    }
    if (__DEV__ && !isPlainObject(current)) {
        throw new Error(
            `${culprit} expects a plain object as ${usedByLocalStore ? "second" : "first"} argument`
        )
    }

    // const [res] = React.useState(() => observable(current, {}, { deep: false }))
    // if (__DEV__ && Object.keys(res).length !== Object.keys(current).length) {
    // The checks above guarantee that `current` is an object here.
    // This check is to satisfy TypeScript's strict null checks.
    if (!current) {
        // This code is unreachable given the checks above, but it helps type narrowing.
        throw new Error("`useAsObservableSource` expects a plain object.")
    }

    const [res] = React.useState(() => observable(current, {}, { deep: false }))
    if (__DEV__ && Object.keys(res).length !== Object.keys(current).length) {

        throw new Error(`the shape of objects passed to ${culprit} should be stable`)
    }
    runInAction(() => {
        Object.assign(res, current)
    })
    return res
}

// export function useAsObservableSource<TSource>(current: TSource): TSource {
//     return useAsObservableSourceInternal(current, false)
    export function useAsObservableSource<TSource extends object>(current: TSource): TSource {
        // The cast is safe because we know `undefined` is not returned when `usedByLocalStore` is `false`.
        return useAsObservableSourceInternal(current, false) as TSource
    }

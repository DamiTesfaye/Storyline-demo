import isFunction from './isFunction';
import isStyledComponent from './isStyledComponent';
import {RuleSet} from "../types";

function isPlainObject(x: any): x is Record<string, any> {
    return x !== null && typeof x === 'object' && x.constructor === Object;
}

function objToCss(obj: Record<string, any>): string {
    let css = '';
    for (const key in obj) {
        const value = obj[key];
        if (value === null || value === undefined || isFunction(value)) continue;

        if (isPlainObject(value)) {
            css += `${key} {${objToCss(value)}}`;
        } else {
            const prop = key.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
            css += `${prop}: ${value};`;
        }
    }
    return css;
}

export default function flatten(chunk: any, executionContext?: object, styleSheet?: any): RuleSet {
    if (Array.isArray(chunk)) {
        const rules: RuleSet = [];
        for (const item of chunk) {
            rules.push(...flatten(item, executionContext, styleSheet));
        }
        return rules;
    }

    if (isFunction(chunk)) {
        return isStyledComponent(chunk) ? [`.${chunk.styledComponentId}`] : flatten(chunk(executionContext), executionContext, styleSheet);
    }

    if (isPlainObject(chunk)) return [objToCss(chunk)];

    return chunk === null || chunk === undefined || chunk === false ? [] : [chunk.toString()];
}
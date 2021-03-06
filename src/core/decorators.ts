import { Type, TypeDecorator, makeDecorator, Inject, Injectable, InjectionToken, Optional } from 'injection-js';
export { Injectable, Inject, Optional, InjectionToken, Type, makeDecorator };

/**
 * Decorator signature
 */
export interface CoreDecorator<T> {
    (obj: T): TypeDecorator;
    new (obj: T): T
}

/**
 * Create a decorator with metadata
 *
 * @param  {string} name
 * @param  {{[name:string]:any;}} props?
 * @returns CoreDecorator
 */
export function createDecorator<T>(name: string, props?: { [name: string]: any; }): CoreDecorator<T> {
    return <CoreDecorator<T>>makeDecorator(name, props);
}

/**
 * HapinessModule decorator and metadata.
 *
 * @Annotation
 */
export interface HapinessModule {
    version: string;
    declarations?: Array<Type<any>|any>;
    providers?: Array<Type<any>|any>;
    imports?: Array<Type<any>|any>;
    exports?: Array<Type<any>|any>;
}
export const HapinessModule = createDecorator<HapinessModule>('HapinessModule', {
    version: undefined,
    declarations: undefined,
    providers: undefined,
    imports: undefined,
    exports: undefined
});

/**
 * Lib decorator and metadata.
 *
 * @Annotation
 */
export interface Lib {}
export const Lib = makeDecorator('Lib', null);

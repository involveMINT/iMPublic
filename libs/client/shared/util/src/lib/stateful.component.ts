import { Directive } from '@angular/core';
import { BehaviorSubject, isObservable, Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RxJSBaseClass } from './rxjs-base-class';

@Directive()
// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class StatefulComponent<State extends {} = {}> extends RxJSBaseClass {
  /** Public/Template facing observable */
  public readonly state$: Observable<State>;

  /** Component State BehaviorSubject */
  private readonly _state$: BehaviorSubject<State>;

  /** Initial Component state stored in the case of calling `resetState` */
  private readonly _initState: State;

  constructor(protected readonly initState: State) {
    super();
    this._initState = initState;
    this._state$ = new BehaviorSubject<State>(initState);
    this.state$ = this._state$.asObservable();
    // this.effect(() => this.state$.pipe(tap((s) => console.log('Stateful Component: ', s))));
  }

  /** Current Component State */
  protected get state(): State {
    return this._state$.value;
  }

  /** Set New Component State */
  protected setState(newState: State): void {
    this._state$.next(newState);
  }

  /** Update State partially and keep non-inputted fields the same */
  protected updateState(newState: Partial<State>): void {
    this._state$.next({ ...this.state, ...newState });
  }

  /** Reset State back to initial state given in class constructor */
  protected resetState(): void {
    this.setState(this._initState);
  }

  /**
   *
   * Creates an effect.
   *
   * This effect is subscribed to for the life of the @Component.
   * @param generator A function that takes an origin Observable input and
   *     returns an Observable. The Observable that is returned will be
   *     subscribed to for the life of the component.
   * @return A function that, when called, will trigger the origin Observable.
   *
   * * Credit to Alex Okrushko via `@ngrx/component-store` for this function.
   */
  effect<
    // This type quickly became part of effect 'API'.
    ProvidedType = void,
    // The actual origin$ type, which could be unknown, when not specified.
    OriginType extends Observable<ProvidedType> | unknown = Observable<ProvidedType>,
    // Unwrapped actual type of the origin$ Observable, after default was applied.
    ObservableType = OriginType extends Observable<infer A> ? A : never,
    // Return either an empty callback or a function requiring specific types as inputs.
    ReturnType = ProvidedType | ObservableType extends void
      ? () => void
      : (observableOrValue: ObservableType | Observable<ObservableType>) => Subscription
  >(generator: (origin$: OriginType) => Observable<unknown>): ReturnType {
    const origin$ = new Subject<ObservableType>();
    generator(origin$ as OriginType)
      // Tied to the lifecycle 👇 of StatefulComponent store.
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    return ((observableOrValue?: ObservableType | Observable<ObservableType>): Subscription => {
      const observable$ = isObservable(observableOrValue) ? observableOrValue : of(observableOrValue);
      return observable$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        // Any new 👇 value is pushed into a stream.
        origin$.next(value);
      });
    }) as unknown as ReturnType;
  }
}

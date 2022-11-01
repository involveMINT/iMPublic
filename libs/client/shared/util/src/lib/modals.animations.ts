import { AnimationController } from '@ionic/angular';
import { Animation } from '@ionic/core';

export const modalsEnterAnimation = (
  height: string,
  baseEl: Element,
  animationCtrl: AnimationController
): Animation => {
  const backdropAnimation = animationCtrl
    .create()
    .addElement(baseEl.querySelector('ion-backdrop') ?? [])
    .fromTo('opacity', '0.01', '0.4');

  const wrapperAnimation = animationCtrl
    .create()
    .addElement(baseEl.querySelector('.modal-wrapper') ?? [])
    .beforeStyles({
      opacity: 1,
      'border-top-right-radius': '15px',
      'border-top-left-radius': '15px',
      'border-bottom-right-radius': '0px',
      'border-bottom-left-radius': '0px',
      height,
      top: `calc(100% - ${height})`,
      project: 'absolute',
    })
    .fromTo('transform', 'translateY(100%)', `translateY(0)`);

  return animationCtrl
    .create()
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(400)
    .beforeAddClass('show-modal')
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

export const modalsLeaveAnimation = (
  height: string,
  baseEl: Element,
  animationCtrl: AnimationController
): Animation => {
  return modalsEnterAnimation(height, baseEl, animationCtrl).direction('reverse');
};

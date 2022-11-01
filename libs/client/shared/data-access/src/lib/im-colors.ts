import { ProfileType } from './+state/session/user-session.reducer';

export function setImPrimaryColors(type?: ProfileType) {
  if (type === 'cm') {
    document.documentElement.style.setProperty('--ion-color-primary', 'var(--im-green)');
    document.documentElement.style.setProperty('--ion-color-primary-rgb', '18, 113, 39');
    document.documentElement.style.setProperty('--ion-color-primary-contrast', 'var(--im-green-contrast)');
    document.documentElement.style.setProperty('--ion-color-primary-shade', 'var(--im-green-shade)');
    document.documentElement.style.setProperty('--ion-color-primary-tint', 'var(--im-green-tint)');
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-shade',
      'var(--im-green-gradient-shade)'
    );
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-tint',
      'var(--im-green-gradient-tint)'
    );
  } else if (type === 'ep') {
    document.documentElement.style.setProperty('--ion-color-primary', 'var(--im-orange)');
    document.documentElement.style.setProperty('--ion-color-primary-rgb', '246, 118, 0');
    document.documentElement.style.setProperty('--ion-color-primary-contrast', 'var(--im-orange-contrast)');
    document.documentElement.style.setProperty('--ion-color-primary-shade', 'var(--im-orange-shade)');
    document.documentElement.style.setProperty('--ion-color-primary-tint', 'var(--im-orange-tint)');
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-shade',
      'var(--im-orange-gradient-shade)'
    );
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-tint',
      'var(--im-orange-gradient-tint)'
    );
  } else if (type === 'sp') {
    document.documentElement.style.setProperty('--ion-color-primary', 'var(--im-purple)');
    document.documentElement.style.setProperty('--ion-color-primary-rgb', '189, 50, 146');
    document.documentElement.style.setProperty('--ion-color-primary-contrast', 'var(--im-purple-contrast)');
    document.documentElement.style.setProperty('--ion-color-primary-shade', 'var(--im-purple-shade)');
    document.documentElement.style.setProperty('--ion-color-primary-tint', 'var(--im-purple-tint)');
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-shade',
      'var(--im-purple-gradient-shade)'
    );
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-tint',
      'var(--im-purple-gradient-tint)'
    );
  } else {
    document.documentElement.style.setProperty('--ion-color-primary', 'var(--im-green)');
    document.documentElement.style.setProperty('--ion-color-primary-rgb', '189, 50, 146');
    document.documentElement.style.setProperty('--ion-color-primary-contrast', 'var(--im-green-contrast)');
    document.documentElement.style.setProperty('--ion-color-primary-shade', 'var(--im-green-shade)');
    document.documentElement.style.setProperty('--ion-color-primary-tint', 'var(--im-green-tint)');
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-shade',
      'var(--im-green-gradient-shade)'
    );
    document.documentElement.style.setProperty(
      '--ion-color-primary-gradient-tint',
      'var(--im-green-gradient-tint)'
    );
  }
}

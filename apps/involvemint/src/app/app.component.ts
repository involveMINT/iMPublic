import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'involvemint-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    const ua = navigator.userAgent.toLowerCase();

    const chromeAgent = ua.indexOf('chrome') > -1;
    const safariAgent = ua.indexOf('safari') > -1 && !chromeAgent;
    if (safariAgent) {
      alert(
        'We see that you are using Safari, we recommend using Chrome for the best involveMINT experience' // Safari
      );
    }
  }
}

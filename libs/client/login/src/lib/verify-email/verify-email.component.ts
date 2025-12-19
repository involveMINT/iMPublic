import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRestClient } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { take } from 'rxjs/operators';

interface State {
  verified: boolean;
  error: string | null;
}

@Component({
  selector: 'login-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly userClient: UserRestClient,
    private readonly route: RouteService
  ) {
    super({ verified: false, error: null });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async ({ email, hash }) => {
      if (!email || !hash) {
        this.updateState({ error: 'No email or hash given.' });
        return;
      }
      try {
        await this.userClient.verifyEmail({}, { email, hash }).pipe(take(1)).toPromise();
        this.updateState({ verified: true });
      } catch (e) {
        this.updateState({ error: e.error.message });
      }
    });
  }

  login() {
    return this.route.to.login.ROOT();
  }
}

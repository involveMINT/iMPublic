import {
  BaSubmitEpApplicationDto,
  ChangePasswordDto,
  CreateChangeMakerProfileDto,
  GetSuperAdminForExchangePartnerDto,
  APIOperationError,
  SignUpDto,
  SubmitEpApplicationDto,
  SubmitSpApplicationDto,
  WalletTabs,
} from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { createAction, props } from '@ngrx/store';
import { ExchangeAdminsWithBaDownloaded, UserSessionState, UserStoreModel } from './user-session.reducer';

export const payTo = createAction('[UserSession] Pay To', props<{ handleId: string; amount?: number }>());

export const toggleWallet = createAction('[UserSession] Toggle Wallet', props<{ open: boolean }>());
export const setWalletTab = createAction('[UserSession] Set Wallet Tab', props<{ tab: WalletTabs }>());

export const loadingRoute = createAction('[UserSession] Loading Route', props<{ route: string }>());

/*
    _   _               _              _
   | | | |___ ___ _ _  | |   ___  __ _(_)_ _
   | |_| (_-</ -_) '_| | |__/ _ \/ _` | | ' \
    \___//__/\___|_|   |____\___/\__, |_|_||_|
                                 |___/
 */

export const userLogin = createAction('[UserSession] User Login', props<{ id: string; password: string }>());

// export const userGoogleLogin = createAction(
//   '[UserSession] User Google Login',
//   props<{ persistance: AuthPersistance }>()
// );

export const userLoginSuccess = createAction(
  '[UserSession] User Login Success',
  props<{ id: string; token: string }>()
);

export const userLoginError = createAction(
  '[UserSession]  User Login Error',
  props<{ error: APIOperationError }>()
);

/*
      _      _       _        _              _
     /_\  __| |_ __ (_)_ _   | |   ___  __ _(_)_ _
    / _ \/ _` | '  \| | ' \  | |__/ _ \/ _` | | ' \
   /_/ \_\__,_|_|_|_|_|_||_| |____\___/\__, |_|_||_|
                                       |___/
*/
export const adminLogin = createAction('[UserSession] Admin Login', props<{ password: string }>());

export const adminLoginSuccess = createAction(
  '[UserSession] Admin Login Success',
  props<{ token: string }>()
);

export const adminLoginError = createAction(
  '[UserSession] Admin Login Error',
  props<{ error: APIOperationError }>()
);

/*
    ___ _             _   _
   / __(_)__ _ _ _   | | | |_ __
   \__ \ / _` | ' \  | |_| | '_ \
   |___/_\__, |_||_|  \___/| .__/
         |___/             |_|
*/

export const userSignUp = createAction('[UserSession] User SignUp', props<{ dto: SignUpDto }>());

export const userSignUpSuccess = createAction(
  '[UserSession] User SignUp Success',
  props<{ token: string }>()
);

export const userSignUpError = createAction(
  '[UserSession]  User SignUp Error',
  props<{ error: APIOperationError }>()
);

/*
     ___     _     _   _               ___       _
    / __|___| |_  | | | |___ ___ _ _  |   \ __ _| |_ __ _
   | (_ / -_)  _| | |_| (_-</ -_) '_| | |) / _` |  _/ _` |
    \___\___|\__|  \___//__/\___|_|   |___/\__,_|\__\__,_|

*/

export const getUserData = createAction('[UserSession] Get User Data');

export const getUserDataSuccess = createAction(
  '[UserSession] Get User Data Success',
  props<UserStoreModel>()
);

export const getUserDataError = createAction(
  '[UserSession] Get User Data Error',
  props<{ error: APIOperationError }>()
);

/*
    ___         _                    _      _       _      
   | _ )_  _ __(_)_ _  ___ ______   /_\  __| |_ __ (_)_ _  
   | _ \ || (_-< | ' \/ -_|_-<_-<  / _ \/ _` | '  \| | ' \ 
   |___/\_,_/__/_|_||_\___/__/__/ /_/ \_\__,_|_|_|_|_|_||_|

*/

export const baDownloadEpAdmin = createAction(
  '[UserSession] Business Admin Download EP Admin',
  props<{ dto: GetSuperAdminForExchangePartnerDto }>()
);
export const baDownloadEpAdminSuccess = createAction(
  '[UserSession] Business Admin Download EP Admin Success',
  props<{ downloadedEpAdmin: ExchangeAdminsWithBaDownloaded }>()
);
export const baDownloadEpAdminError = createAction(
  '[UserSession] Business Admin Download EP Admin Error',
  props<{ error: APIOperationError }>()
);

export const baRemoveDownloadedEpAdmin = createAction(
  '[UserSession] Business Admin Remove Downloaded EP Admin',
  props<{ downloadedEpAdmin: ExchangeAdminsWithBaDownloaded }>()
);
export const baRemoveDownloadedEpAdminSuccess = createAction(
  '[UserSession] Business Admin Remove Downloaded EP Admin Success',
  props<{ id: string }>()
);
export const baRemoveDownloadedEpAdminError = createAction(
  '[UserSession] Business Admin Remove Downloaded EP Admin Error',
  props<{ error: APIOperationError }>()
);

export const baSubmitEpApplication = createAction(
  '[UserSession] Business Admin Submit Ep Application',
  props<{ dto: BaSubmitEpApplicationDto }>()
);

export const baSubmitEpApplicationSuccess = createAction(
  '[UserSession] Business Admin Submit Ep Application Success',
  props<{ downloadedEpAdmin?: ExchangeAdminsWithBaDownloaded }>()
);

export const baSubmitEpApplicationError = createAction(
  '[UserSession] Business Admin Submit Ep Application Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                    
   / __|_ _  ___  ___ _ __ 
   \__ \ ' \/ _ \/ _ \ '_ \
   |___/_||_\___/\___/ .__/
                     |_|   
*/

export const snoop = createAction('[UserSession] Snoop', props<{ userId: string }>());

export const snoopSuccess = createAction('[UserSession] Snoop Success', props<UserStoreModel>());

export const snoopError = createAction('[UserSession] Snoop Error', props<{ error: APIOperationError }>());

/*
    ___      _       _      _   _           ___          __ _ _
   / __| ___| |_    /_\  __| |_(_)_ _____  | _ \_ _ ___ / _(_) |___
   \__ \/ -_)  _|  / _ \/ _|  _| \ V / -_) |  _/ '_/ _ \  _| | / -_)
   |___/\___|\__| /_/ \_\__|\__|_|\_/\___| |_| |_| \___/_| |_|_\___|

  */
export const setActiveProfile = createAction(
  '[UserSession] Set Active Profile',
  props<{ profileId: string }>()
);

/*
    _                 ___       _
   | |   ___  __ _   / _ \ _  _| |_
   | |__/ _ \/ _` | | (_) | || |  _|
   |____\___/\__, |  \___/ \_,_|\__|
             |___/
*/
export const userLogOut = createAction('[UserSession] User Log Out');

/*
     ___              _          ___ __  __   ___          __ _ _
    / __|_ _ ___ __ _| |_ ___   / __|  \/  | | _ \_ _ ___ / _(_) |___
   | (__| '_/ -_) _` |  _/ -_) | (__| |\/| | |  _/ '_/ _ \  _| | / -_)
    \___|_| \___\__,_|\__\___|  \___|_|  |_| |_| |_| \___/_| |_|_\___|

*/
export const createChangeMakerProfile = createAction(
  '[UserSession] Create ChangeMaker Profile',
  props<{ dto: CreateChangeMakerProfileDto }>()
);

export const createChangeMakerProfileSuccess = createAction(
  '[UserSession] Create ChangeMaker Profile Success',
  props<{ cmProfile: NonNullable<UserStoreModel['changeMaker']> }>()
);

export const createChangeMakerProfileError = createAction(
  '[UserSession] Create ChangeMaker Profile Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _          _ _     ___          _             _ _         _   _
   / __|_  _| |__ _ __ (_) |_  | __|_ __    /_\  _ __ _ __| (_)__ __ _| |_(_)___ _ _
   \__ \ || | '_ \ '  \| |  _| | _|| '_ \  / _ \| '_ \ '_ \ | / _/ _` |  _| / _ \ ' \
   |___/\_,_|_.__/_|_|_|_|\__| |___| .__/ /_/ \_\ .__/ .__/_|_\__\__,_|\__|_\___/_||_|
                                   |_|          |_|  |_|
*/
export const submitEpApplication = createAction(
  '[UserSession] Submit Ep Application',
  props<{ dto: SubmitEpApplicationDto }>()
);

export const submitEpApplicationSuccess = createAction(
  '[UserSession] Submit Ep Application Success',
  props<{ epApp: UserStoreModel['epApplications'] extends Array<infer A> ? A : never }>()
);

export const submitEpApplicationError = createAction(
  '[UserSession] Submit Ep Application Error',
  props<{ error: APIOperationError }>()
);

/*
   __      ___ _   _       _                   ___          _
   \ \    / (_) |_| |_  __| |_ _ __ ___ __ __ | __|_ __    /_\  _ __ _ __
    \ \/\/ /| |  _| ' \/ _` | '_/ _` \ V  V / | _|| '_ \  / _ \| '_ \ '_ \
     \_/\_/ |_|\__|_||_\__,_|_| \__,_|\_/\_/  |___| .__/ /_/ \_\ .__/ .__/
                                                  |_|          |_|  |_|
*/
export const withdrawEpApplication = createAction(
  '[UserSession] Withdraw Ep Application',
  props<{ epApp: UnArray<UserStoreModel['epApplications']> }>()
);

export const withdrawEpApplicationSuccess = createAction(
  '[UserSession] Withdraw Ep Application Success',
  props<{ deletedId: string }>()
);

export const withdrawEpApplicationError = createAction(
  '[UserSession] Withdraw Ep Application Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _          _ _     ___          _             _ _         _   _
   / __|_  _| |__ _ __ (_) |_  / __|_ __    /_\  _ __ _ __| (_)__ __ _| |_(_)___ _ _
   \__ \ || | '_ \ '  \| |  _| \__ \ '_ \  / _ \| '_ \ '_ \ | / _/ _` |  _| / _ \ ' \
   |___/\_,_|_.__/_|_|_|_|\__| |___/ .__/ /_/ \_\ .__/ .__/_|_\__\__,_|\__|_\___/_||_|
                                   |_|          |_|  |_|
*/

export const submitSpApplication = createAction(
  '[UserSession] Submit Sp Application',
  props<{ dto: SubmitSpApplicationDto }>()
);

export const submitSpApplicationSuccess = createAction(
  '[UserSession] Submit Sp Application Success',
  props<{ spApp: UserStoreModel['spApplications'] extends Array<infer A> ? A : never }>()
);

export const submitSpApplicationError = createAction(
  '[UserSession] Submit Sp Application Error',
  props<{ error: APIOperationError }>()
);

/*
   __      ___ _   _       _                   ___          _
   \ \    / (_) |_| |_  __| |_ _ __ ___ __ __ / __|_ __    /_\  _ __ _ __
    \ \/\/ /| |  _| ' \/ _` | '_/ _` \ V  V / \__ \ '_ \  / _ \| '_ \ '_ \
     \_/\_/ |_|\__|_||_\__,_|_| \__,_|\_/\_/  |___/ .__/ /_/ \_\ .__/ .__/
                                                  |_|          |_|  |_|
*/
export const withdrawSpApplication = createAction(
  '[UserSession] Withdraw Sp Application',
  props<{ spApp: UnArray<UserStoreModel['spApplications']> }>()
);

export const withdrawSpApplicationSuccess = createAction(
  '[UserSession] Withdraw Sp Application Success',
  props<{ deletedId: string }>()
);

export const withdrawSpApplicationError = createAction(
  '[UserSession] Withdraw Sp Application Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _ ___   ___      _   _   _
   | | | |_ _| / __| ___| |_| |_(_)_ _  __ _ ___
   | |_| || |  \__ \/ -_)  _|  _| | ' \/ _` (_-<
    \___/|___| |___/\___|\__|\__|_|_||_\__, /__/
                                       |___/
*/

export const toggleNavTabs = createAction('[UserSession] Toggle Nav Tabs', props<{ on: boolean }>());
export const sideMenuBehavior = createAction(
  '[UserSession] Toggle Side Menu Behavior',
  props<{ behavior: UserSessionState['sideMenuBehavior'] }>()
);

/*
     ___ _                         ___                              _ 
    / __| |_  __ _ _ _  __ _ ___  | _ \__ _ _______ __ _____ _ _ __| |
   | (__| ' \/ _` | ' \/ _` / -_) |  _/ _` (_-<_-< V  V / _ \ '_/ _` |
    \___|_||_\__,_|_||_\__, \___| |_| \__,_/__/__/\_/\_/\___/_| \__,_|
                       |___/                                          
*/
export const changePassword = createAction(
  '[UserSession] Change Password',
  props<{ dto: ChangePasswordDto }>()
);

export const changePasswordSuccess = createAction('[UserSession] Change Password Success');

export const changePasswordError = createAction(
  '[UserSession] Change Password Error',
  props<{ error: APIOperationError }>()
);

/*
    ___ _      _    _         _              _    _     
   | __(_)_ _ (_)__| |_    _ | |___ _  _ _ _(_)__| |___ 
   | _|| | ' \| (_-< ' \  | || / _ \ || | '_| / _` / -_)
   |_| |_|_||_|_/__/_||_|  \__/\___/\_, |_| |_\__,_\___|
                                    |__/                
*/
export const finishJoyride = createAction('[UserSession] Finish Joyride');

export const finishJoyrideSuccess = createAction('[UserSession] Finish Joyride Success');

export const finishJoyrideError = createAction(
  '[UserSession] Finish Joyride Error',
  props<{ error: APIOperationError }>()
);

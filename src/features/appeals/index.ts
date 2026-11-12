/** @/features/appeals — `/appeals`: unblock requests from blocked players and team owners (approve / reject). */

// Screens
export { AppealsScreen } from './screen/appeals.screen';

// Components (the Teams detail panel reviews a team's request in place)
export { ApproveAppealDialog, RejectAppealDialog } from './components/review-appeal-dialogs';

// Types
export type { Appeal, AppealKind, AppealStatus } from './types';

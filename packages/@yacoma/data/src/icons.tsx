import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen'
import { faHammer } from '@fortawesome/free-solid-svg-icons/faHammer'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { faSplotch } from '@fortawesome/free-solid-svg-icons/faSplotch'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTooth } from '@fortawesome/free-solid-svg-icons/faTooth'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons/faUserGraduate'

export const icons: { [key: string]: IconDefinition } = {
  admin: faHammer,
  // FIXME: rename to ProtectedUser
  protected: faUserGraduate,
  ProtectedUser: faUserGraduate,
  email: faEnvelope,
  user: faUser,
  username: faUser,
  password: faLock,
  folder: faFolder,
  folderOn: faFolderOpen,
  Loading: faSpinner,
  Validate: faTooth,
  Offline: faExclamationTriangle,
  PleaseLogin: faLock,
  ResetField: faTimes,
  RefreshWord: faSync,
  InvalidUsernameOrPassword: faTrash,
  TooManyEmotions: faSplotch,
}

library.add(...Object.keys(icons).map(k => icons[k]))

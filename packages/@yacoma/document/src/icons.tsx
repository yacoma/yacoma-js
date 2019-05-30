import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faFolder as faFolderRegular } from '@fortawesome/free-regular-svg-icons/faFolder'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf'
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons/faFolderPlus'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons/faShieldAlt'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends'
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons/faUserGraduate'

export const icons: { [key: string]: IconDefinition } = {
  UserAccess: faShieldAlt,
  CollectionAccess: faEye,
  explorer: faBars,
  search: faSearch,
  Access_a: faShieldAlt,
  Access_e: faPen,
  Access_r: faEye,
  AccessCheck: faEyeSlash,
  AccessCheckOn: faEye,
  Add: faPlus,
  Back: faArrowLeft,
  Close: faTimesCircle,
  // Are these used anymore ?
  Collection: faFolder,
  Collections: faFolder,
  // ?
  Contact: faUser,
  Edit: faPen,
  FolderCaret: faCaretRight,
  FolderCaretOpen: faCaretDown,
  Item: faFileAlt,
  Items: faFileAlt,
  File: faFile,
  FileImage: faFileImage,
  FilePdf: faFilePdf,
  FileUpload: faCloudUploadAlt,
  MyCollection: faHome,
  NewDocument: faFileAlt,
  NewCollection: faFolderPlus,
  OwnCollection: faFolderRegular,
  PairCollection: faUser,
  PrivateCollection: faLock,
  Remove: faTimes,
  ResetField: faTimes,
  Save: faSave,
  Upload: faCloudUploadAlt,
  // Is User icon used ? Shouldn't this be just Contact ?
  User: faUser,
  Users: faUserFriends,
  WorkCollection: faUserGraduate,
}

library.add(...Object.keys(icons).map(k => icons[k]))

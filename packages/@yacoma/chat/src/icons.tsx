import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments'
import { faDotCircle } from '@fortawesome/free-solid-svg-icons/faDotCircle'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
// import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus'
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie'

export const icons: { [key: string]: IconDefinition } = {
  AdminUser: faUserTie,
  Attachment: faPaperclip,
  Message: faComment,
  MessageExtra: faEllipsisH,
  Messages: faComment,
  MeWorkCollection: faComment,
  NewContact: faUserPlus,
  Search: faSearch,
  Send: faPaperPlane,
  User: faUser,
  UsersCollection: faComments,
  UsersPrivate: faDotCircle,
  UsersWorkCollection: faComment,
}

library.add(...Object.keys(icons).map(k => icons[k]))

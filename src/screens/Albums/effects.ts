import * as _ from "lodash"
import { Dispatch } from "redux"
import {
  AlbumsLoadStartedAction,
  AlbumsLoadSucceededAction,
  AlbumsLoadFailedAction
} from "./actions"
import { RawAlbumRecord } from "./models"

export type LoadAlbumsEffect = () => (dipatch: Dispatch) => void

// Yeah, this is really cool, yet comes with a small price to pay, namely: action objects are defined as classes !
// Returning new Action(arg1, arg2, ..., argN) in an action-creator would return non-plain objects to the Redux store,
// causing a run-time exception / error.
// So - the price - we need to call lodash _.toPlainObject() in action-creators to convert complex JavaScript object to plain object.

export const loadAlbums: LoadAlbumsEffect = () => (dispatch: Dispatch) => {
  dispatch(_.toPlainObject(new AlbumsLoadStartedAction()))
  fetch("/json/albums.json")
    .then((value: Response) => {
      return value.json()
    })
    .then((value: RawAlbumRecord[]) => {
      dispatch(_.toPlainObject(new AlbumsLoadSucceededAction(value)))
    })
    .catch((error) => {
      dispatch(_.toPlainObject(new AlbumsLoadFailedAction(error)))
    })
}

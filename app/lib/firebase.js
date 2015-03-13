import Firebase from 'firebase'

const BASE_URL = 'https://rerenote.firebaseio.com/'

export default {

  getRef() {
    return new Firebase(BASE_URL)
  }

}
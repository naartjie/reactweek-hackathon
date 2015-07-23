### Instructions

Open up 2 browsers side by side: http://rerenote.firebaseapp.com.

 * Add a note
 * Move a note
 * Edit a note
 * Watch the changes in the other browser

### Why is this great?
* We don't need stores - Firebase is our store
* We don't need Flux
* Our code is simpler as a result of using Firebase
* It turns out Firebase and React work together beautifully:
  * the React way is to just declare what the view looks like, given a state
  * Firebase gives us exactly this, by using .on('value') callback
  * this is the simplest/rawest of all the callbacks Firebase gives is, we don't care about the changes, give us the whole lot!

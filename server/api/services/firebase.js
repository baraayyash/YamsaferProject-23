    var Firebase = require("firebase");
    //https://fiery-inferno-1435.firebaseio.com/
    var usersRef = new Firebase('https://fiery-inferno-1435.firebaseio.com/');

			//used push to add data to firebase
    //  var postsRef = usersRef.child("names");
    // var postsRef1 = postsRef.push({
    // author: "author1",
    // title: "title1"
    // });
    // var postsRef2 =postsRef.push({
    // author: "author2",
    // title: "title2"
    // });
    // var postID1 = postsRef1.key();
    // var postID2=postsRef2.key();
    // console.log(postID1);
    //   console.log(postID2);
    //  var postsRef = usersRef.child("names");
    // var postsRef3 = postsRef.push({
    // author: "author5",
    // title: "title5"
    // });*/

		//value which returns the entire contents of the location,
// usersRef.on("value", function(snapshot) {
// console.log(snapshot.val());
// }, function (errorObject) {
// console.log("The read failed: " + errorObject.code);
// });
/*

	//child_added is triggered once for each existing child 
	//and then again every time a new child is added to the specified path.
// postsRef.on("child_added", function(snapshot, prevChildKey) {
// var newPost = snapshot.val();
// console.log("Author: " + newPost.author);
// console.log("Title: " + newPost.title);
// console.log("Previous Post ID: " + prevChildKey);
// })

    //return first two childs 
// usersRef.child("names").limitToFirst(2).on("child_added", function(snapshot) {
// console.log(snapshot.key());
// });

    //return query depending on certain name 
usersRef.child("names").orderByChild("author").equalTo("author5").on("child_added", function(snapshot) {
console.log(snapshot.key());
var newPost = snapshot.val();
 console.log("Author: " + newPost.author);
 console.log("Title: " + newPost.title);
});
*/

usersRef.child("names").on('value', function(snap) {
console.log(snap.val());
//var result = snap.val() === null? 'is not' : 'is';
//console.log('Mary ' + result + ' a member of alpha group');
});
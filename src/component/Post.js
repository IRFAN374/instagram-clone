import React, { useEffect, useState } from 'react';
import '../style/Post.css'
import Avatar from '@material-ui/core/Avatar';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { db } from '../db/Firebase'
import firebase from 'firebase'


function Post({post,user,postId}) {

  const [ comments, setComments] = useState([])
  const [comment, setComment] = useState('')


  useEffect(()=>{
   let unsubscribe;
   if(postId){
     unsubscribe = db.collection("posts").doc(postId)
     .collection("comments").orderBy('timestamp','desc')
     .onSnapshot((snapshot)=>{
       setComments(snapshot.docs.map((doc)=> doc.data()))
     })
   }
   return ()=>{
     unsubscribe();
   }
  },[postId])

  const postComment = (event)=>{
    event.preventDefault()
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('')
  }


  return (
    <div className="post">
        <div className="post__header">
          <Avatar className="post__avatar" alt={post.username} src="/static/images/avatar/1.jpg" />
          <h3>{post.username}</h3>
        </div> 
      <img className="post__image" src={post.imageUrl} alt="post_image" />
        
      <h4 className="post__text"><strong>@{post.username}</strong> {post.caption}</h4>
      <div className="post__comments">
          {
            comments.map((comment)=>{
              return (
                <p>
                  <strong>{comment.username}:</strong>  {comment.text}
                </p>
              )
            })
          }
      </div>
      { user && (
            <form className="post__commentBox">
              <Input className="post__input" type="text" placeholder="Add a comment" value={comment} onChange={(event)=> setComment(event.target.value)} />
              <Button className="post__button" disabled={!comment} type="submit" onClick={postComment} variant="contained" color="primary" >Post</Button>
            </form>
        ) }
    </div>
  )
}

export default Post

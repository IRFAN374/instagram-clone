import React, { useEffect, useState } from 'react';
import './style/App.css';
import Post from './component/Post';
import instgram_logo from './images/instagram-logo.png'
import { db, auth } from './db/Firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import  Button  from '@material-ui/core/Button'
import Input from '@material-ui/core/Input';
// import InstagramEmbed from 'react-instagram-embed';

import ImageUpload from './component/ImageUpload';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts] = useState([]);
  const [ open, setOpen] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null);
  const [ openSignIn, setOpenSignIn] = useState(false)

  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  useEffect(()=>{
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user logged in
        console.log(authUser)
        setUser(authUser)
        
      }else{
        // user logged out
        setUser(null)
      }
    })
    return ()=>{
      // perform clean up operation
      unsubscribe()
    }
  },[user,username])

  useEffect(()=>{
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>{
      // every timke  anew post is added this part will run
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    })
  },[])

  

  const logIn = (event) =>{
     event.preventDefault()
     //console.log("user is:", event.value)
     
     auth.signInWithEmailAndPassword(email,password)
     .then(()=>{})
     .catch((error)=>alert(error.message))
     setPassword('')
     setEmail('')
     setOpenSignIn(false)
  }

 const signUp = (event)=>{
   event.preventDefault();
   auth.createUserWithEmailAndPassword(email,password)
   .then((authUser)=>{
    return authUser.user.updateProfile({
       displayName: username
     })
   })
   .catch((error)=> alert(error.message))
   setPassword('')
   setEmail('')
   setUserName('')
   setOpen(false)
 }

  return (
    <div className="app">
     
       <Modal open={open} onClose={()=> setOpen(false)} >
          <div style={modalStyle} className={classes.paper}>
              <center>
                <div className="app__header">
                  <img className="app__headerImage" src= {instgram_logo} alt="Logo file" />
                </div>
              </center>
              <div>
                <h2 style={{marginLeft: '100px', marginTop: "20px", marginBottom: "20px"}}> let's Sign Up</h2>
                <form className="app__form">
                  <Input style={{marginBottom: '15px'}} placeholder="user name" type="text" value={username} onChange={(event)=> setUserName(event.target.value)} />
                  <Input style={{marginBottom: '15px'}} placeholder="Email Id" type="email" value={email}  onChange={(event)=> setEmail(event.target.value)}  />
                  <Input style={{marginBottom: '15px'}} placeholder="Password" type="password" value={password}  onChange={(event)=> setPassword(event.target.value)}  />
                  <Button type="submit" variant="contained" color="primary" onClick={signUp} fullWidth style={{marginTop: '10px'}}> Sign Up</Button>
                </form>
              </div>
          </div>
      </Modal>

      <Modal open={openSignIn} onClose={()=> setOpenSignIn(false)} >
          <div style={modalStyle} className={classes.paper}>
              <center>
                <div className="app__header">
                  <img className="app__headerImage" src= {instgram_logo} alt="Logo file" />
                </div>
              </center>
              <div>
                <h2 style={{marginLeft: '100px', marginTop: "20px", marginBottom: "20px"}}> let's Login In</h2>
                <form className="app__form">
                  <Input style={{marginBottom: '15px'}} placeholder="Email Id" type="email" value={email}  onChange={(event)=> setEmail(event.target.value)}  />
                  <Input style={{marginBottom: '15px'}} placeholder="Password" type="password" value={password}  onChange={(event)=> setPassword(event.target.value)}  />
                  <Button type="submit" variant="contained" color="primary" onClick={logIn} fullWidth style={{marginTop: '10px'}}> Log In</Button>
                </form>
              </div>
          </div>
      </Modal>


      <div className="app__header">
         <img className="app__headerImage" src= {instgram_logo} alt="Logo file" />

          <div>
            { user ? (
                <Button style={{marginLeft: '20px'}} type="button" color="secondary" variant="contained" onClick={()=> auth.signOut()}> Log Out </Button >  
            ):(
              <div>
                <Button style={{marginLeft: '20px'}} type="button" color="secondary" variant="contained" onClick={()=> setOpen(true)}> Sign Up </Button >
                <Button style={{marginLeft: '20px'}} type="button" color="primary" variant="contained" onClick={()=> setOpenSignIn(true)}> Log In </Button >
              </div>

            )}
          </div>
      </div>

     

      <div className="app__post">
          <div className="app_postleft">
          { posts.map(({post,id})=>{ return( <Post key={id} user={user} post={post} postId={id} /> ) }) }
          </div>
          <div className="app_postright paper">
            { user?.displayName ? 
                ( <ImageUpload username={user.displayName} /> )
                :(<h3>Login to upload image</h3>)
            }
          </div>

      </div>
      {/* <InstagramEmbed url='https://instagr.am/p/HeZ7IxgUUc/' //clientAccessToken='123|456' maxWidth={320} hideCaption={false} containerTagName='div' protocol='' injectScript onLoading={() => {}} onSuccess={() => {}} onAfterRender={() => {}} onFailure={() => {}} /> */}
    </div>
  );
}

export default App;

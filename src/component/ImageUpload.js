import React, { useState } from 'react'
import Input  from '@material-ui/core/Input'
import Button  from '@material-ui/core/Button'
import { storage,db } from '../db/Firebase';
import firebase from 'firebase'
import '../style/imageupload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("")

    const handleChange = (event)=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    const handleUpload = ()=>{
        
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                //progress functions
                const progress = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes)*100 );
                setProgress(progress)
            },
            (error)=>{
                console.log(error.message)
                alert(error.message)
            },
            ()=>{
                // complete functions
                 storage.ref("images").child(image.name).getDownloadURL()
                 .then( url =>{
                     db.collection("posts").add({
                         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                         caption: caption,
                         imageUrl: url,
                         username: username 
                     });
                     setProgress(0);
                     setCaption('')
                     setImage(null)
                 })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" style={{marginTop: '20px'}} />
           <Input type="text" placeholder="Enter a caption..." value ={caption} onChange={(event)=> setCaption(event.target.value)} style={{marginTop: '20px'}} />
           <Input type="file" onChange={handleChange} style={{marginTop: '20px'}} />
           <Button onClick = {handleUpload} variant="contained" color="primary" style={{marginTop: '20px'}}> upload</Button>    
        </div>
    )
}

export default ImageUpload

import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { loginSuccess } from '../../redux/userSlice'
import axios from '../../axios'
import {imgDb} from '../../firebase'
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'

export default function Acount() {
    const {currentUser}=useSelector(state=>state.user)
    const [imageSrc, setImageSrc] = useState(`${currentUser.image}`);
    const [file,setFile]=useState()
    const [percent, setPercent] = useState(0);
    const name=useRef()
    const email=useRef()
    const address=useRef()
    const phone=useRef()
    const [values,setValue]=useState({
        name:currentUser.name,
        email:currentUser.email,
        address:currentUser.address,
        phone:currentUser.phone
    })
    const handleInput=(event)=>{
        setValue((prev)=>({...prev,[event.target.name]:event.target.value}))
    }
    const handleName=()=>{
        name.current.disabled =false
        name.current.focus();
    }
    const handleEmail=()=>{
        email.current.disabled =false
        email.current.focus();
    }
    const handleAddress=()=>{
        address.current.disabled =false
        address.current.focus();
    }
    const handlePhone=()=>{
        phone.current.disabled =false
        phone.current.focus();
    }
    const dispatch=useDispatch()
    const handleImage=()=>{
        const fileInput=document.getElementById('fileInput')
        fileInput.click()
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFile(file)
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
      useEffect(() => {
        const uploadImage = async () => {
            try {
                if (file) {
                    const imgRef = ref(imgDb, `/files/${file.name}`);
                    const uploadTask = uploadBytesResumable(imgRef, file);
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            setPercent(percent);
                        },
                        (err) => console.log(err),
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            setValue(prev => {
                                return { ...prev, image: url };
                            });
                        }
                    );
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        };
        uploadImage();
    }, [file]);
    const handleUpdate=async(e)=>{
        e.preventDefault()
            try {
                const res=await axios.put(`/user/update/${currentUser._id}`,values)
                dispatch(loginSuccess(res.data))
                name.current.disabled =true
                email.current.disabled =true
                address.current.disabled =true
                phone.current.disabled =true
                alert("success")
            } catch (err) {
               alert("failure")
            }
    }
  return (
    <div className='px-3'>
        <div>
            <div className='row '>
                <div className='col-3 mb-4'>
                    <div className='bg-light border border-2 position-relative w-100' style={{height:"180px"}}>
                        <img src={currentUser.image ? imageSrc : "/assets/user/no_avatar.png"} alt="" className='w-100 h-100 ' style={{objectFit:"cover"}}/>
                        <input type="file" name='file' className='position-absolute top-0 start-0 opacity-0' id='fileInput' onChange={handleImageChange}/>
                        <div className='w-25 h-25 position-absolute top-0 d-flex justify-content-center align-items-center border rounded-circle border-2 bg-light' style={{cursor:"pointer"}} onClick={handleImage}>
                            <i className='fa fa-camera fs-4'></i>
                        </div>
                    </div>
                    <div className='' style={{height:"20px",background:"linear-gradient(12deg,red,blue)",width:`${percent}%`}}>{file && `${percent}%`}</div>
                </div>
                <div className="col-2 d-flex flex-column">
                    <span className='mb-2'>Name</span>
                    <span className='mb-2'>Email</span>
                    <span className='mb-2'>Address</span>
                    <span className='mb-3'>Phone</span>
                </div>
                <div className="col-7">
                    <div><input type="text" className='mb-2 bg-light ' name="name" onChange={handleInput} disabled style={{border:"none",outline:"none"}} value={values.name} ref={name}/><i className='fa fa-pencil' style={{cursor:"pointer"}} onClick={handleName}></i></div>
                    <div><input type="text" className='mb-2 bg-light ' name='email' onChange={handleInput} disabled style={{border:"none",outline:"none"}}  value={values.email} ref={email}/><i className='fa fa-pencil' style={{cursor:"pointer"}} onClick={handleEmail}></i></div>
                    <div><input type="text" id className='mb-2 bg-light ' name='address' onChange={handleInput} disabled style={{border:"none",outline:"none"}}  value={values.address} ref={address}/><i className='fa fa-pencil' style={{cursor:"pointer"}} onClick={handleAddress}></i></div>
                    <div><input type="text" className='mb-2 bg-light ' name='phone' onChange={handleInput} disabled style={{border:"none",outline:"none"}}  value={values.phone ? values.phone : ""} ref={phone}/><i className='fa fa-pencil' style={{cursor:"pointer"}} onClick={handlePhone}></i></div>
                </div>
            </div>
            <button className='rounded-3 text-white text-center py-1' type='submit' 
              style={{width:"100px",backgroundColor:"#b8860b",cursor:"pointer"}} 
              onClick={handleUpdate}>Cập nhật</button>
        </div>
    </div>
  )
}

import React from 'react'

export default function Banner() {
  return (
    <div className='h-100 w-100 gap-1 d-flex'>
      <div className='h-100'>
        <img src="/assets/banner/bn1.png" className='h-100 w-100 border rounded-3' style={{objectFit:"cover"}} alt="" />
      </div>
      <div className='d-flex flex-column h-100 gap-2'>
        <div style={{height:"33%"}}>
          <img src="/assets/banner/bn2.png" alt="" className='h-100 w-100 border rounded-3'style={{objectFit:"cover"}}/>
        </div>
        <div style={{height:"33%"}}><img src="/assets/banner/bn3.png" alt="" className='h-100 w-100 border rounded-3'style={{objectFit:"cover"}}/></div>
        <div style={{height:"33%"}}><img src="/assets/banner/bn4.png" alt="" className='h-100 w-100 border rounded-3'style={{objectFit:"cover"}}/></div>
      </div>
    </div>
  )
}

import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login(){
const navigate = useNavigate();
function handleLogin(e){
e.preventDefault();
// demo - skip auth
navigate('/dashboard');
}
return (
<div style={{display:'flex',height:'100vh',justifyContent:'center',alignItems:'center'}}>
<form onSubmit={handleLogin} style={{width:320}}>
<h2>Smart HR Portal</h2>
<input placeholder="email" style={{width:'100%',padding:8,marginBottom:8}}/>
<input placeholder="password" type="password" style={{width:'100%',padding:8,marginBottom:8}}/>
<button style={{width:'100%',padding:8}}>Login</button>
</form>
</div>
);
}

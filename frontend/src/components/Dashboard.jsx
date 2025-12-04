import React, {useEffect, useState} from 'react';
import axios from 'axios';


export default function Dashboard(){
const [employees, setEmployees] = useState([]);
useEffect(()=>{
axios.get(process.env.REACT_APP_API_URL + '/employees')
.then(r=>setEmployees(r.data))
.catch(()=>setEmployees([]));
},[]);


return (
<div style={{padding:20}}>
<h1>Employees</h1>
<table border="1" cellPadding="8">
<thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
<tbody>
{employees.map(e=> (
<tr key={e._id}><td>{e.name}</td><td>{e.role}</td><td>{e.email}</td></tr>
))}
</tbody>
</table>
</div>
);
}

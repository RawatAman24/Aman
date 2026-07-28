import { useState } from "react";
function AddWaste() {
const [waste,setWaste]=useState({
name:"",
type:"",
weight:""
});
const handleChange=(e)=>{
setWaste({...waste,[e.target.name]:e.target.value});
}
const handleSubmit=(e)=>{
e.preventDefault();
alert("Waste Added Successfully");
console.log(waste);
}
return(
<div className="container">
<h2>Add Waste</h2>
<form onSubmit={handleSubmit}>
<input
type="text"
name="name"
placeholder="Waste Name"
onChange={handleChange}/>
<input
type="text"
name="type"
placeholder="Waste Type"/>
<input
type="number"
name="weight"
placeholder="Weight"/>
<button>Add Waste</button>
</form>
</div>
)
}

export default App.js
;
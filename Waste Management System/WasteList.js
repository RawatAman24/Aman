import App from "./App";

const data = [
{
name:"Plastic",
type:"Dry",
weight:"20 Kg"
},
{
name:"Glass",
type:"Dry",
weight:"15 Kg"
},
{
name:"Food Waste",
type:"Wet",
weight:"35 Kg"
}
];
function WasteList(){
return(
<div className="container">
<h2>Waste List</h2>
<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Weight</th>
</tr>
</thead>
<tbody>
{
data.map((item,index)=>(
<tr key={index}>
<td>{item.name}</td>
<td>{item.type}</td>
<td>{item.weight}</td>
</tr>
))
}
</tbody>
</table>
</div>
)
}
export default App;
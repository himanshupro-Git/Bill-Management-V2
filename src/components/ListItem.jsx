import './ListItem.css'
export default function ListItem({items, handleDelete}){
    return(
        <div className='listContainer'>
            <h3 className='listHeading'>List Items</h3>
            {items.map((item, index)=>(
                <div className='itemBox' key={index}> 
                <div className='itemRow'>
                    <div className='itemName'>Name: {item.name}</div>
                    <div className='itemPrice'>Price: ₹{item.price}</div>
                    <div className='itemQuantity'>Quantity: {item.quantity}</div>
                    <button 
                    className='deleteButton'
                    onClick={()=>{handleDelete(index)}}>Delete</button>
                    
                </div>
                </div>
            ))}
        </div>
    )
}
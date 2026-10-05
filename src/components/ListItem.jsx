import './ListItem.css';
export default function ListItem({items,handleDelete,handleQuantityChange}) {
  return (
    <div className="listContainer">
      <h3 className="listHeading">List Items</h3>

      {items.map((item, index) => (
        <div className="itemBox" key={index}>
          <div className="itemRow">

            <div className="itemName">
              Name: {item.name}
            </div>

            <div className="itemPrice">
              Price: ₹{item.price}
            </div>

            <div className="itemQuantity">
              Quantity: {item.quantity}
            </div>

            <div className="quantityControls">
              <button
                className="quantityButton"
                onClick={() => handleQuantityChange(index, -1)}
              >
                −
              </button>

              <span className="quantityValue">
                {item.quantity}
              </span>

              <button
                className="quantityButton"
                onClick={() => handleQuantityChange(index, 1)}
              >
                +
              </button>
            </div>

            <button
              className="deleteButton"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}
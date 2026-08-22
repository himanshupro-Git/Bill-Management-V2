import './InputBox.css';

export default function InputBox({
  name,
  price,
  quantity,
  setQuantity,
  handleAdd,
  handleNameChange,
  handleBarcode
}) {
  return (
    <div className="inputBox">

      {/* Product Name */}
      <input
        type="text"
        className="input"
        placeholder="Write here"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAdd();
          }
        }}
      />

      {/* Price */}
      <input
        type="number"
        className="input"
        id="priceInput"
        placeholder="Price"
        value={price}
        readOnly
      />

      {/* Quantity */}
      <input
        type="number"
        className="input"
        id="quantityInput"
        placeholder="Count"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAdd();
          }
        }}
      />

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="addButton"
      >
        Add
      </button>

      {/* Scan Button */}
      <button
        onClick={handleBarcode}
        className="scanButton"
      >
        Scan Barcode
      </button>

    </div>
  );
}
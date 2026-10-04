import './app.css';
import { useState } from 'react';
import InputBox from './components/InputBox';
import ListItem from './components/ListItem';
import Totalbill from './components/Totalbill';
import products from './data/products.json';
import Scanner from './components/Scanner';

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // Total number of items
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Product total before GST
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate GST for each product
  const tax = items.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity * item.gstRate) / 100,
    0
  );

  // Final amount
  const total = subtotal + tax;

  // Find a product using name or barcode
  function findProduct(value) {
    return products.find(
      (product) =>
        product.barcode === value ||
        product.name.toLowerCase() === value.toLowerCase()
    );
  }

  // Select a product
  function selectProduct(product) {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price);
    setSuggestion([]);
  }

  // Add selected product to cart
  function handleAdd() {
    if (!name || !price || !quantity) return;

    const newProduct = {
      id: selectedProduct?.id || `TEMP-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      barcode: selectedProduct?.barcode || "",
      gstRate: selectedProduct?.gstRate || 0,
      stock: selectedProduct?.stock || 0,
      category: selectedProduct?.category || "Other"
    };

    // Check if this product is already in the cart
    const existingIndex = items.findIndex(
      (item) => item.id === newProduct.id
    );

    if (existingIndex !== -1) {
      // Same product: increase quantity of the existing row
      const updatedItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + newProduct.quantity }
          : item
      );
      setItems(updatedItems);
    } else {
      // New product: add as a separate row
      setItems([...items, newProduct]);
    }

    setName("");
    setPrice("");
    setQuantity("");
    setSelectedProduct(null);
    setSuggestion([]);
  }

  // Delete a product from cart
  function handleDelete(indexToDelete) {
    const updatedItems = items.filter(
      (_, index) => index !== indexToDelete
    );

    setItems(updatedItems);
  }

  // Search products by name
  function handleNameChange(value) {
    setName(value);

    // User is typing manually, so previous selection is cleared
    setSelectedProduct(null);

    if (value === "") {
      setSuggestion([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestion(filtered);
  }

  // Handle a barcode value
  function handleBarcode(value) {
  const product = findProduct(value);

  if (product) {
    selectProduct(product);
    setShowScanner(false);
  } else {
    alert("Product not found");
  }
}

  return (
    <div className="outerMainBox">

      <div className="mainBox">

        <h2 className="heading">List Manager</h2>

        <InputBox
          name={name}
          setPrice={setPrice}
          price={price}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAdd={handleAdd}
          handleNameChange={handleNameChange}
          handleBarcode={() => setShowScanner(true)}
        />

        <div className="suggestion">
          {suggestion.map((item) => (
            <div
              key={item.id}
              onClick={() => selectProduct(item)}
              className="suggestionBox"
            >
              {item.name} - ₹{item.price}
            </div>
          ))}
        </div>

        <ListItem
          items={items}
          handleDelete={handleDelete}
        />

      </div>

      <Totalbill
        items={items}
        itemCount={itemCount}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />

        {showScanner && (
        <Scanner
        onScan={handleBarcode}
        onClose={() => setShowScanner(false)}
        />
        )}

    </div>
  );
}

export default App;

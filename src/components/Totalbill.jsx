import { useRef } from 'react';
import html2pdf from "html2pdf.js";

import './Totalbill.css';
export default function Totalbill({itemCount, subtotal, tax, total}){
    const billRef = useRef();

    function handlePrint(){
        const element =  billRef.current;
        html2pdf().from(element).save("bill.pdf")
    }

    return(
        <div>
        <div className='totalBillBox' ref={billRef}>
            <h2 className='heading'>Total Bill</h2>

            <p className='totalItems'>Total Items: {itemCount}</p>
            <p className='Subtotal'>Subtotal: ₹{(subtotal || 0).toFixed(2)}</p>
            <p className='tax'>Tax (30%): ₹{(tax || 0).toFixed(2)}</p>
            <div className='line'></div>
            <p className='total'>Total: ₹{(total || 0).toFixed(2)}</p>
        </div>
        <div>
            <button  className='printButton'
            onClick={handlePrint}>
                Print PDF
            </button>
        </div>
        </div>
    );
}
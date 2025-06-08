import { useContext, useState } from 'react';
import './CartSummary.css';
import { AppContext } from '../../context/AppContext';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import { createOrder, deleteOrder } from '../../Service/OrderService';
import toast from 'react-hot-toast';
import { AppConstants } from '../../util/Constants';
import { createRazorpayOrder, verifyPayment } from '../../Service/PaymentService';
import axios from 'axios';


const CartSummary = ({ customerName, setCustomerName, mobileNumber, setMobileNumber }) => {
    const { cartItems, clearCart } = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);



    const clearAll = () => {

        setCustomerName("");
        setMobileNumber("");
        clearCart();

    }
    const placeOrder = () => {
        console.log("place order called ....")
        console.log("order details.....",orderDetails)
        console.log("order details isProcessing....",isProcessing)
        setShowPopup(true);
        clearAll();
    }

    const handlePrintReceipt = () => {
        window.print();
    }


    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const tax = totalAmount * 0.01;

    const grandTotal = totalAmount + tax;

    // const loadRazorpayScript = () => {
    //     return new Promise((resolve, reject) => {
    //         const script = document.createElement('script');
    //         script.src = "https://checkout.razorpay.com/v1/checkout.js";
    //         script.onload = () => resolve(true);
    //         script.onerror = () => resolve(false);
    //         document.body.appendChild(script);

    //     })
    // }


    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                console.log("✅ Razorpay script loaded.");
                resolve(true);
            };
            script.onerror = () => {
                console.error("❌ Failed to load Razorpay script.");
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };


    // const loadRazorpayScript = () => {
    //     return new Promise((resolve, reject) => {
    //         if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
    //             return resolve(true); // Already loaded
    //         }
    //         const script = document.createElement("script");
    //         script.src = "https://checkout.razorpay.com/v1/checkout.js";
    //         script.onload = () => resolve(true);
    //         script.onerror = () => reject(false);
    //         document.body.appendChild(script);
    //     });
    // };


    const deleteOrderOnFailure = async (orderId) => {
        console.log("delete order on failure.....",orderId)
        try {
            await deleteOrder(orderId)
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }

    }

    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("please Enter customer Details");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your Cart is Empty");
            return;
        }
        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subTotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase()
        }
        setIsProcessing(true);
        try {
            const response = await createOrder(orderData);
            console.log("response from complete payment", response);
            const savedData = response.data;
            if (response.status === 201 && paymentMode === 'cash') {
                toast.success("Cash received");
                setOrderDetails(savedData);
                console.log("cash resceived",orderDetails,orderData);
                

            } else if (response.status === 201 && paymentMode === 'upi') {
                const razorpayLoaded = await loadRazorpayScript();
                console.log("Razorpay order data", response.data);
                console.log("Saved Order", savedData);
                if (!razorpayLoaded) {
                    toast.error("Unable to load Razorpay");
                    await deleteOrderOnFailure(savedData.orderId);
                    return;
                }


                const razorpayResponse = await createRazorpayOrder({ amount: grandTotal, currency: "INR" });
                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorpayResponse.data.amount,
                    currency: razorpayResponse.data.currency,
                    order_id: razorpayResponse.data.id,
                    name: "Billing Software",
                    description: "Order Payment",
                    handler: async function (response) {
                        //todo verify the payment
                        await verifyPaymentHandler(response, savedData);
                    },
                    prefill: {
                        name: customerName,
                        contact: mobileNumber
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: async () => {
                            await deleteOrderOnFailure(savedData.orderId);
                            toast.success("Payment Cancelled");
                        }
                    },

                };
                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", async (response) => {
                    await deleteOrderOnFailure(savedData.orderId);
                    toast.error("Payment failed");
                    console.error( "rzp on payment failed....",response.error.description);
                });
                if (!window.Razorpay) {
                    console.error("❌ Razorpay is not loaded on window.");
                    return;
                }
                rzp.open();

            }

        } catch (error) {
            console.error("catch block rzr pay.....",error);
            toast.error("Payment processing Failed 3");
        } finally {
            setIsProcessing(false);
        }
    }

    const verifyPaymentHandler = async (response, savedOrder) => {
        const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: savedOrder.orderId
        };

        try {
            const paymentResponse = await verifyPayment(paymentData);

            console.log("payment response",paymentResponse)

            if (paymentResponse.status === 201) {
                toast.success("Payment successful");
               await  setOrderDetails({
                    ...savedOrder,
                    paymentDetails: {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature
                    },
                });
            } else {
                toast.error("Payment Processing Failed 1");
            }

        } catch (error) {
            console.error( "verify payment",error);
            toast.error("Payment Processing Failed 2")
        }
    };
    return (

        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Item:</span>
                    <span className="text-light">&#8377;{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (1%): </span>
                    <span className="text-light">&#8377;{tax.toFixed(2)} </span>
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">Total: </span>
                    <span className="text-light">&#8377;{grandTotal.toFixed(2)} </span>

                </div>
            </div>

            <div className="d-flex gap-3">
                <button className="btn btn-success flex-grow-1"
                    onClick={() => completePayment("cash")}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "CASH"}
                </button>

                <button className="btn btn-primary flex-grow-1"
                    onClick={() => completePayment("upi")}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "UPI"}
                </button>
            </div>

            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-warning flex-grow-1"
                    onClick={placeOrder}
                    disabled={isProcessing || !orderDetails}
                >
             Place Order
                </button>

            </div>

            {
                showPopup && (
                    <ReceiptPopup 
                    orderDetails={{
                        ...orderDetails,
                        razorpayOrderId: orderDetails?.paymentDetails?.razorpayOrderId || '',
                        razorpayPaymentId: orderDetails?.paymentDetails?.razorpayPaymentId || '',
                    }}
                    onClose={() => setShowPopup(false)}
                    onPrint={handlePrintReceipt}    
                    
                    />
                )
            }
        </div>
    )

}



export default CartSummary;
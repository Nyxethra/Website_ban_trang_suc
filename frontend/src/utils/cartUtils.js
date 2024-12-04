import axios from '../axios';

export const addToCart = async (productId, price, quantity = 1) => {
    try {
        await axios.post("/cart/create", {
            productId: productId,
            quantity: quantity,
            totalAmount: price * quantity
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
} 
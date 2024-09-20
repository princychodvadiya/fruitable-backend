const Carts = require("../model/carts.model");

const updatecart = async (req, res) => {
    try {
        const carts = await Carts.findByIdAndUpdate(req.params.cart_id, req.body, { new: true, runValidators: true })
        console.log(carts);

        if (!carts) {
            return res.status(400).json({
                success: false,
                message: 'carts not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'carts update successfully',
            data: carts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error' + error.message
        })
    }
}

const getcartUser = async (req, res) => {
    try {
        const carts = await Carts.findById(req.params.cart_id)

        if (!carts) {
            res.status(404).json({
                success: false,
                message: 'carts not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'carts fetch successfully.',
            data: carts
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const ListCart = async (req, res) => {
    try {
        const cart = await Carts.find();

        if (!cart) {
            res.status(404).json({
                success: false,
                message: 'cart not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'cart list successfully.',
            data: cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const updatequantity = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const cart = await Carts.findById(req.params.cart_id);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        cart.items[itemIndex].quntity = quantity;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Item quantity updated successfully',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: ' + error.message
        });
    }
};

const decrementQuantity = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        console.log(product_id, quantity);

        const cart = await Carts.findById(req.params.cart_id);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
        // console.log(itemIndex);


        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        if (cart.items[itemIndex].quntity > quantity) {
            cart.items[itemIndex].quntity -= quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Item quantity decremented successfully',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: ' + error.message
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { cart_id, product_id } = req.params;

        console.log(cart_id, product_id);

        const cart = await Carts.findById(cart_id);

        if (!cart) {
            return res.status(404).json({

                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        // res.status(200).json({ cart_id, product_id });

        const updatedCart = await Carts.findById(cart_id);

        return res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully',
            data: updatedCart
        });

        // return res.status(200).json({
        //     success: true,
        //     message: 'Product removed from cart successfully',
        //     data: {
        //         cart_id,
        //         product_id
        //     }
        // });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

// const addCart = async (req, res) => {
//     try {
//         const cart = await Carts.create(req.body);
//         if (!cart) {
//             res.status(400).json({
//                 success: false,
//                 message: "cart parameters is missing.",
//             })
//         }
//         res.status(201).json({
//             success: true,
//             message: "cart added successfully.",
//             data: cart
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal server error" + error.message
//         })
//     } 
// }

const AddTOCart = async (req, res) => {
    try {
        const { user_id, isActive = true, items } = req.body;
        console.log("oihoiyhlo", req.body);

        let cart = await Carts.findOne({ user_id });

        if (!cart) {
            cart = new Carts({ user_id, isActive, items });
        } else {
            items.forEach(item => {
                const itemIndex = cart.items.findIndex(v => v.product_id.toString() === item.product_id);

                if (itemIndex !== -1) {
                    cart.items[itemIndex].quntity += item.quntity;
                } else {
                    cart.items.push({ product_id: item.product_id, quntity: item.quntity });
                }
            });
        }
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Cart updated successfully.',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};


module.exports = {
    updatecart,
    getcartUser,
    updatequantity,
    AddTOCart,
    deleteCartItem,
    ListCart,
    decrementQuantity
}
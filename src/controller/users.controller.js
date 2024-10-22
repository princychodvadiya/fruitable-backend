const Users = require("../model/users.model");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { sendMail } = require("../utils/nodemailer");
const { pdfmake } = require("../utils/pdfmake");

const randomstring = require("randomstring");
const uploadFile = require("../utils/cloudinary");

const AccRefToken = async (id) => {
    try {
        const user = await Users.findById(id);
        console.log("juhivbndfikjvn", user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid request."
            })
        }

        const AccessToken = await jwt.sign({
            _id: user._id,
            role: user.role,
            expiresIn: 360000
        },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: 360000 });

        const RefreshToken = await jwt.sign({
            _id: user._id
        },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: 3600000 });

        user.RefreshToken = RefreshToken;
        await user.save({ validateBeforeSave: false })
        return { AccessToken, RefreshToken }

    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    try {
        // console.log("sdssss", req.body);
        // console.log(req.file);

        if (req.file) {
            const { email, password, name } = req.body;

            const fileRes = await uploadFile(req.file.path, "avtar");
            console.log("Uploaded File", fileRes);

            const user = await Users.findOne(
                { $or: [{ email }] }
            );
            // console.log("okttt", user);

            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            const hashpassoword = await bcrypt.hash(password, 10);
            console.log("ok4444", hashpassoword);

            if (!hashpassoword) {
                return res.status(409).json({
                    success: false,
                    message: "password is valid while hasing error.",
                });
            }

            const newdata = await Users.create({
                ...req.body,
                password: hashpassoword,
                avtar: {
                    public_id: fileRes.public_id,
                    url: fileRes.url
                }
            })
            console.log("newdata", newdata);

            if (!newdata) {
                return res.status(500).json({
                    success: false,
                    message: "internal server erorr.",
                });
            }

            const newdataf = await Users.findById({ _id: newdata._id }).select("-password");

            if (!newdataf) {
                return res.status(500).json({
                    success: false,
                    message: "internal server erorr.",
                });
            }
            const otp = randomstring.generate({ length: 6, charset: 'numeric' });
            // console.log("Generated:", otp);

            await Users.updateOne({ email }, { otp });

            sendMail(newdataf.name, newdataf.email, `Your OTP for password reset is: ${otp}`);

            res.status(201).json({
                success: true,
                message: "user created successfully.",
                data: newdataf
            });

        } else {
            const { email, password, name } = req.body;

            const user = await Users.findOne(
                { $or: [{ email }] }
            );
            // console.log("okttt", user);

            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            const hashpassoword = await bcrypt.hash(password, 10);
            console.log("ok4444", hashpassoword);

            if (!hashpassoword) {
                return res.status(409).json({
                    success: false,
                    message: "password is valid while hasing error.",
                });
            }

            const newdata = await Users.create({
                ...req.body,
                password: hashpassoword
            })
            console.log("newdata", newdata);

            if (!newdata) {
                return res.status(500).json({
                    success: false,
                    message: "internal server erorr.",
                });
            }

            const newdataf = await Users.findById({ _id: newdata._id }).select("-password");

            if (!newdataf) {
                return res.status(500).json({
                    success: false,
                    message: "internal server erorr.",
                });
            }
            const otp = randomstring.generate({ length: 6, charset: 'numeric' });
            // console.log("Generated:", otp);

            await Users.updateOne({ email }, { otp });

            sendMail(newdataf.name, newdataf.email, `Your OTP for password reset is: ${otp}`);

            res.status(201).json({
                success: true,
                message: "user created successfully.",
                data: newdataf
            });

        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server erorr." + error.message,
        });
    }
}

const registerverifyOTP = async (req, res) => {
    const { otp, email } = req.body;
    console.log("u8ijhcf", otp, email);

    try {
        const user = await Users.findOne({ email });
        console.log("user", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        console.log(otp);

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }
        user.otp = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "OTP validated successfully."
        });
    } catch (error) {
        console.error('OTP validation error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
}

const verifyOTP = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "verifyOTP successfully session."
    });
}

const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await Users.findOne(
            { $or: [{ email }] }
        );

        console.log("defefg", user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not exist.",
            });
        }

        const validateUser = await bcrypt.compare(password, user.password);
        console.log(validateUser);

        if (!validateUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid password.",
            });
        }

        const { AccessToken, RefreshToken } = await AccRefToken(user._id);

        // console.log(AccessToken, RefreshToken);
        const newdataf = await Users.findById({ _id: user._id }).select("-password -RefreshToken");

        const optionAcc = {
            httpOnly: true,
            secure: true,
            maxAge: 360000, // 1 hour
            sameSite: "None"
        }

        const optionRef = {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "None"
        }

        res.status(200)
            .cookie("AccessToken", AccessToken, optionAcc)
            .cookie("RefreshToken", RefreshToken, optionRef)
            .json({
                success: true,
                message: "login succsecfully.",
                data: { ...newdataf.toObject(), AccessToken }

            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server erorr.",
        });
    }
}

const newToken = async (req, res) => {
    // console.log("ok");
    // console.log(req.body);
    try {
        // console.log("hhh", req.cookies.RefreshToken);

        const validateToken = await jwt.verify(req.cookies.RefreshToken, "trrerefsdfdfe")
        // console.log("uuu", validateToken);

        if (!validateToken) {
            return res.status(401).json({
                success: false,
                message: "invalid refresh token."
            })
        }

        const user = await Users.findById(validateToken._id)
        // console.log(user, "ajikshd");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user is not found."
            })
        }

        const { AccessToken, RefreshToken } = await AccRefToken(user._id);

        if (req.cookies.RefreshToken != user.toObject().RefreshToken) {
            return res.status(401).json({
                success: false,
                message: "invalid Token."
            })
        }

        const option = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.status(200)
            .cookie("AccessToken", AccessToken, option)
            .cookie("RefreshToken", RefreshToken, option)
            .json({
                success: true,
                message: "Refresh Token Sucessfully",
                data: {
                    AccessToken
                }
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server erorr." + error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        console.log("fgdg", req.body._id);
        const user = await Users.findByIdAndUpdate(
            req.body._id,
            {
                $unset: {
                    RefreshToken: 1
                }
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not login.'
            });
        }

        res.status(200)
            .clearCookie("AccessToken")
            .clearCookie("RefreshToken")
            .json({
                success: true,
                message: "User Logeed Out."
            });
    } catch (error) {
        console.error('Logout error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Logout failed.'
        });
    }
}

const chackAuth = async (req, res) => {
    try {
        const AccessToken = await req.cookies.AccessToken
        console.log(AccessToken);

        if (!AccessToken) {
            return res.status(401).json({
                success: false,
                message: 'Access Token not found.'
            })
        }

        const validateUser = await jwt.verify(AccessToken, process.env.ACCESS_TOKEN_KEY)
        console.log(validateUser);

        if (!validateUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Access Token.'
            })
        }

        res.status(200).json({
            success: true,
            data: validateUser,
            message: "success"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server erorr." + error.message,
        });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.user_id)

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'user not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'user fetch successfully.',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const orderofuser = async (req, res) => {
    const user = await Users.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "user_id",
                as: "userOrders"
            }
        },
        {
            $unwind: {
                path: "$userOrders",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                "userOrders.orderId": 1,
                "userOrders.orderDate": 1,
                "userOrders.totalAmount": 1
            }
        },
        {
            $sort: {
                "userOrders.orderDate": -1
            }
        },
        {
            $limit: 100
        }
    ])
    res.status(200).json({
        success: true,
        message: 'user fetch successfully.',
        data: user
    })
}

const listUser = async (req, res) => {
    try {
        const user = await Users.find();

        if (!user) {
            res.status(404).json({
                success: false,
                meassage: 'user not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'user fetch successfully.',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.user_id, req.body, { new: true, runValidators: true });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'user not updated.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'user updated successfully.',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.user_id)

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'user not deleted.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'user deleted successfully.',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const reviewofuser = async (req, res) => {

}

const metchUserData = async (req, res) => {
    try {
        const user = await Users.find();
        // console.log("ok222222222",user);

        if (!user || user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const userData = user.map(({ _id, name, email, role }) => ({
            _id,
            name,
            email,
            role
        }));

        console.log("dfht", userData);


        return res.status(200).json({
            success: true,
            message: 'User fetched successfully.',
            data: userData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: ' + error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = randomstring.generate({ length: 6, charset: 'numeric' });
        console.log("Generated OTP:", otp);

        await Users.updateOne({ email }, { otp });

        sendMail(user.name, user.email, `Your OTP for password reset is: ${otp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const validateOtp = async (req, res) => {
    const { otp, email } = req.body;
    console.log(otp);

    try {
        const user = await Users.findOne({ email });
        console.log("user", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }
        user.otp = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "OTP validated successfully."
        });
    } catch (error) {
        console.error('OTP validation error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        if (!newPassword || newPassword.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "New password is required."
            });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.otp = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const updateUserProfile = async (req, res) => {
    const { user_id } = req.params;
    const { name, email } = req.body;

    try {
        let updateData = {};

        if (req.file) {
            const fileRes = await uploadFile(req.file.path, "avtar");
            console.log("Uploaded File", fileRes);

            updateData.avtar = {
                public_id: fileRes.public_id,
                url: fileRes.url,
            };
        }

        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const updatedUser = await Users.findByIdAndUpdate(user_id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

module.exports = {
    AccRefToken,
    register,
    login,
    newToken,
    logout,
    registerverifyOTP, verifyOTP,
    chackAuth,
    getUser,
    orderofuser,
    listUser,
    updateUser,
    deleteUser,
    reviewofuser,
    metchUserData,
    forgotPassword,
    validateOtp,
    resetPassword,
    updateUserProfile
}

// const register = async (req, res) => {
//     try {
//         console.log(req.body);

//         const { email, password } = req.body;
//         const user = await Users.findOne({ $or: [{ email }] });

//         if (user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         const hashPassword = await bcrypt.hash(password, 10);
//         if (!hashPassword) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Password hashing error.",
//             });
//         }

//         const newUser = await Users.create({ ...req.body, password: hashPassword });

//         if (!newUser) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Internal server error.",
//             });
//         }

//         const otp = randomstring.generate({ length: 6, charset: 'numeric' });
//         await Users.updateOne({ _id: newUser._id }, { otp });

//         sendMail(newUser.name, newUser.email, `Your OTP for registration is: ${otp}`);

//         res.status(201).json({
//             success: true,
//             message: "User created successfully. An OTP has been sent to your email.",
//             data: { ...newUser.toObject(), password: undefined, otp: undefined }
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal server error." + error.message,
//         });
//     }
// };
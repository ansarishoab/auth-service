const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    console.log(email, password);
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const isPasswordMatch  = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600
        });

        return res.status(200).json({token});
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

exports.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

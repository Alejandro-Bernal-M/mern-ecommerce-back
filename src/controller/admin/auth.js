const User = require('../../models/user')
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const userFoundByEmail = await User.findOne({email: req.body.email});
  const userFoundByUsername = await User.findOne({username: req.body.username});

  if(userFoundByEmail || userFoundByUsername){
    return res.status(400).json({message: 'admin already exists'});
  }else {
    try{const {firstName, lastName, username, password, email} = req.body;
    const newUser = new User({
      firstName,
      lastName,
      username,
      password,
      email,
      role: 'admin'
    });
    const savedUser = await newUser.save();
    if(savedUser === newUser){
      return res.json({user: savedUser});
    }else{
      return res.status(400).json({message: 'Error saving the admin'});
    }
  }catch(error){
    console.log(error);
    return res.status(400).json({message: 'Something went wrong', errors: error.errors})
  }
  }
}

exports.signin = async (req, res) => {
  
  try {
    const foundUser = await User.findOne({email: req.body.email});
    if(!foundUser) return res.status(400).json({message: "Invalid email or password"});
    if(foundUser.authenticate(req.body.password) && foundUser.role === 'admin'){
      console.log(foundUser)
      const token = jwt.sign({_id: foundUser._id, role: foundUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
      const {_id, firstName, lastName, email, role, fullName } = foundUser;

      return res.status(200).json({
        token,
        user: {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName
        }
      })
    }else {
      return res.status(400).json({message: "Invalid email or password"});
    }
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Something went wrong"});
  }
}

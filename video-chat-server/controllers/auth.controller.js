import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Необходимо указать полное имя, email и пароль" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль должен содержать минимум 6 символов" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: fullName,  // сохраняем fullName в поле name
      email,
      password: hashedPassword
    });

    // Генерация JWT-токена и установка в cookie
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.name,
      email: newUser.email,
      // Если в будущем появится поле profilePic, можно добавить его сюда
    });
  } catch (error) {
    console.error("Ошибка в signup контроллере:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ message: "Успешный вход", token });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Вы успешно вышли" });
  } catch (error) {
    console.error("Ошибка в logout контроллере:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req,res) => {
  try {
      res.status(200).json(req.user);

  } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({message:"Internal Server Error"}); 
  }
}
// Остальные функции (например, protectRoute) остаются без изменений

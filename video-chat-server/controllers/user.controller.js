import User from '../models/user.model.js';

export const getProfile = async (req, res) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error("Ошибка получения профиля", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };
  
  export const getOnlineUsers = async (req, res) => {
    try {
      const { ids } = req.body;
      console.log('Received IDs:', ids); // Логируем полученные IDs
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs array is required' });
      }
  
      const users = await User.find({ '_id': { $in: ids } });
      console.log('Found users:', users); // Логируем найденных пользователей
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
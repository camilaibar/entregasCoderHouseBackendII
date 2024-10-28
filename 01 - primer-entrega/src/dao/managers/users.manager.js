import userModel from "../models/user.model.js";

// Create a new user
export const createUser = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    return newUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Find a user by email
export const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

// Find a user by _id
export const findUserById = async (id) => {
  try {
    const user = await userModel.findOne({ _id: id });
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

// Update a user
export const updateUser = async (userId, updateData) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    await userModel.findByIdAndDelete(userId);
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

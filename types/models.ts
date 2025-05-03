export enum Role {
  USER = "user",
  ADMIN = "admin",
  CHEF = "chef",
}

export interface Image {
  id: string;
  url: string;
  altText?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  avatar?: Image;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  image?: Image;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
  categoryId?: string;
  banner?: Image;
  category?: Category;
}

export interface Menu {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  restaurantId: string;
  restaurant?: Restaurant;
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
  menuId?: string;
  categoryId?: string;
  category?: Category;
  menu?: Menu;
}

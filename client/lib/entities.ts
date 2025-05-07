export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture: string;
  team_id: string;
  is_online: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  products: Product[];
  users: User[];
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  team_id: string;
  created_at: string;
}

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

export enum Status {
  ACTIVE = "active",
  DRAFT = "draft",
  DELETED = "deleted",
}

export interface Product {
  id: string;
  title: string;
  description: string;
  picture: string;
  status: Status;
  team_id: string;
  created_at: string;
}

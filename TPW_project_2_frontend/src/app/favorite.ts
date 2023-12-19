import { User } from './user';
import { Product } from './product';
export interface Favorite {
  id: number;
  user_id: User;
  product_id: Product;
}

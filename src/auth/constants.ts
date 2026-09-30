import { jwtSecret } from '../offline-config';
export const jwtConstants = {
  get secret() {
    return jwtSecret();
  },
};

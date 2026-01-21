import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly user = {
    id: 1,
    username: 'Thanathorn',
    passwordHash: bcrypt.hashSync('6704101332', 10),
  };

  private readonly SECRET = 'SUPER_SECRET_KEY';

  login(username: string, password: string): string | null {
    if (username !== this.user.username) return null;

    const isMatch = bcrypt.compareSync(password, this.user.passwordHash);
    if (!isMatch) return null;

    return jwt.sign(
      { userId: this.user.id, username: this.user.username },
      this.SECRET,
      { expiresIn: '1h' },
    );
  }
}

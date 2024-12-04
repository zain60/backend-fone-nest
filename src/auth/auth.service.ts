
import { v4 as uuidv4 } from 'uuid';
import { decrypt, encrypt } from 'src/utils/utils.service';
import { ConfigService } from '@nestjs/config';
import { TenantsConnectionService } from '../shared/services/tenants-connection.service';
import { Secrets, SecretsSchema } from './schemas/secrets.schema';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    // private configService: ConfigService,
    private tenantConnectionService: TenantsConnectionService,
    // private jwtService: JwtService,
    // private usersService: UsersService,

  ) { }
 


  // async login(loginData: LoginDto) {
  //   const { email, password } = loginData;
  //   const user = await this.usersService.getUsersByEmail(email);
  //   if (!user) {
  //     throw new UnauthorizedException('Wrong credentials');
  //   }

  //   //Compare entered password with existing password
  //   const passwordMatch = await bcrypt.compare(password, user.password);
  //   if (!passwordMatch) {
  //     throw new UnauthorizedException('Wrong credentials');
  //   }


  //   //Fetch tenant specific secret key
  //   const secretKey = await this.fetchAccessTokenSecretSigningKey(
  //     user.tenantId,
  //   );
  //   //Generate JWT access token
  //   const accessToken = await this.jwtService.sign(
  //     { userId: user._id },
  //     { secret: secretKey, expiresIn: '10h' },
  //   );

  //   return { accessToken, tenantId: user.tenantId };
  // }

  async createSecretKeyForNewTenant(tenantId: string) {

    const jwtSecret = uuidv4();

    const encryptedSecret = encrypt(
      jwtSecret,
      "encryptionSecretKey",
    );

    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );


    await SecretsModel.create({ jwtSecret: encryptedSecret });

  }

  async fetchAccessTokenSecretSigningKey(tenantId: string) {
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );

    const secretsDoc = await SecretsModel.findOne();
    const secretKey = decrypt(
      secretsDoc.jwtSecret,
      "encryptionSecretKey",
    );
    return secretKey;
  }
}


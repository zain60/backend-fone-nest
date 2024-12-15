
import { v4 as uuidv4 } from 'uuid';
import { decrypt, encrypt } from '../../libs/services/Encryption.service';
import { ConfigService } from '@nestjs/config';
import { TenantsConnectionService } from '../../libs/services/tenants-connection.service';
import { Secrets, SecretsSchema } from '../../schemas/secrets.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private tenantConnectionService: TenantsConnectionService,
    private configService: ConfigService,

  ) { }
 
  async createSecretKeyForNewTenant(tenantId: string) {

    const jwtSecret = uuidv4();

    const encryptedSecret = encrypt(
      jwtSecret,
      this.configService.get('security.encryptionSecretKey'),
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
      this.configService.get('security.encryptionSecretKey'),

    );
    return secretKey;
  }
}


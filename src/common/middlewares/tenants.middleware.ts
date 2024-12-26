import {
    Injectable,
    NestMiddleware,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  import { TenantsService } from 'src/modules/tenants/tenants.service';
  
  @Injectable()
  export class TenantsMiddleware implements NestMiddleware {
    constructor(private tenantsService: TenantsService) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
      //Check that host exists in the headers of the request
      const domain = req.headers.host || req.get('origin');
      console.log({domain});
      // const tenantId = req.headers['x-tenant-id']?.toString();
      if (!domain) {
        throw new BadRequestException('domain not provided');
      }
  
      const tenant = await this.tenantsService.getTenantByDomain(domain);
      if (!tenant) {
        throw new NotFoundException('Tenant does not exist');
      }
      //Set the tenantId on the request object for later access
      req['tenantId'] = tenant.tenantId;
      next();
    }
  }
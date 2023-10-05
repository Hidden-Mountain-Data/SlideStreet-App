import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyInConnectService {
  private readonly inConnectUrl: string = 'https://ics.inhandnetworks.com/v1';

  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(method: string, url: string, data?: any) {
    const response$ = this.httpService.request({
      method,
      url: `${this.inConnectUrl}${url}`,
      data,
    });

    return firstValueFrom(response$);
  }
}

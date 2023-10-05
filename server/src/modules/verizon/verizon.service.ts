import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class VerizonService {
  private readonly accessKey: string;
  private readonly secretAccessKey: string;
  private readonly baseURL: string = 'https://api.verizon.com';

  constructor(private configService: ConfigService) {
    this.accessKey = this.configService.get<string>('VERIZON_ACCESS_KEY');
    this.secretAccessKey = this.configService.get<string>(
      'VERIZON_SECRET_ACCESS_KEY',
    );
  }

  async getSomeData(): Promise<any> {
    const headers = {
      'X-Access-Key': this.accessKey,
      'X-Secret-Access-Key': this.secretAccessKey,
    };

    try {
      const response = await axios.get(`${this.baseURL}/some-endpoint`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch from Verizon API:', error);
      throw new Error('Verizon API request failed.');
    }
  }

  // create(createVerizonDto: CreateVerizonDto) {
  //   return 'This action adds a new verizon';
  // }

  // findAll() {
  //   return `This action returns all verizon`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} verizon`;
  // }

  // update(id: number, updateVerizonDto: UpdateVerizonDto) {
  //   return `This action updates a #${id} verizon`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} verizon`;
  // }
}

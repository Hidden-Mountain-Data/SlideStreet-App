import { Injectable } from '@nestjs/common';
import { CreateInConnectDto } from './dto/create-in-connect.dto';
import { UpdateInConnectDto } from './dto/update-in-connect.dto';

@Injectable()
export class InConnectService {
  create(createInConnectDto: CreateInConnectDto) {
    return 'This action adds a new inConnect';
  }

  findAll() {
    return `This action returns all inConnect`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inConnect`;
  }

  update(id: number, updateInConnectDto: UpdateInConnectDto) {
    return `This action updates a #${id} inConnect`;
  }

  remove(id: number) {
    return `This action removes a #${id} inConnect`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShiftsService {
  constructor(@InjectRepository(Shift) private repo: Repository<Shift>) {}

  async endCurrentShift() {
    const shift = await this.getCurrentShift();
    shift.endDate = new Date();
    return await shift.save();
  }

  async getCurrentShift() {
    const shift = await this.repo.findOne({ where: { endDate: null } });
    if (!shift) throw new NotFoundException('No hay un turno activo');
    return shift;
  }

  async startShift() {
    return Shift.save({ startDate: new Date() });
  }
}

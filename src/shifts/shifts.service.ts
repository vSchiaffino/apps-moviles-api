import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftGateway } from './shift-gateway.service';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift) private repo: Repository<Shift>,
    private shiftGateway: ShiftGateway,
  ) {}

  async endCurrentShift() {
    const shift = await this.getCurrentShift();
    shift.endDate = new Date();
    await shift.save();
    this.notifyShiftChange();
  }

  async getCurrentShift() {
    const shift = await this.repo.findOne({ where: { endDate: IsNull() } });
    if (!shift) throw new NotFoundException('No hay un turno activo');
    return shift;
  }

  async startShift() {
    if (await this.repo.findOne({ where: { endDate: IsNull() } })) {
      throw new BadRequestException('Ya hay un turno activo');
    }
    const shift = await Shift.save({ startDate: new Date() });
    this.notifyShiftChange();
    return shift;
  }

  async notifyShiftChange() {
    this.shiftGateway.server.emit('shiftChange');
  }
}

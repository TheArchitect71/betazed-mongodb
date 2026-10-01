import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PeopleService } from './people.service';
@Controller('people')
@UseGuards(JwtAuthGuard)
export class PeopleController {
  constructor(private people: PeopleService) {}
  @Get() list(@Request() req) {
    return this.people.list(req.user.userId);
  }
  @Get(':id') find(@Request() req, @Param('id') id: string) {
    return this.people.find(req.user.userId, id);
  }
  @Post() create(@Request() req, @Body() body: unknown) {
    return this.people.create(req.user.userId, body);
  }
  @Put(':id') update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.people.update(req.user.userId, id, body);
  }
  @Delete(':id') @HttpCode(204) remove(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.people.remove(req.user.userId, id);
  }
}

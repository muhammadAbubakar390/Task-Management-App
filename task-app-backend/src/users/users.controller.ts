import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(@Request() req): Promise<UserResponseDto[]> {
    return this.usersService.findAll(req.user as User);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id, req.user as User);
  }

  @Post()
  @Roles('ADMIN')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto, req.user as User);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<void> {
    return this.usersService.remove(id, req.user as User);
  }

  @Get('profile/me')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.findOne(req.user.userId, req.user as User);
  }
}
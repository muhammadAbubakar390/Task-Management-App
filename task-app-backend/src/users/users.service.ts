import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(currentUser: User): Promise<UserResponseDto[]> {
    // Only admin can see all users
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can view all users');
    }

    const users = await this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });
    
    return users.map(user => new UserResponseDto(user));
  }

  async findOne(id: string, currentUser: User): Promise<UserResponseDto> {
    // Users can only see their own profile, admin can see anyone
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Return without password
    const { password: _, ...result } = savedUser;
    return new UserResponseDto(result);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<UserResponseDto> {
    // Users can only update their own profile, admin can update anyone
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user fields
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.usersRepository.save(user);
    
    // Return without password
    const { password: _, ...result } = updatedUser;
    return new UserResponseDto(result);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    // Only admin can delete users
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can delete users');
    }

    // Don't allow self-deletion (optional)
    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Express } from 'express';
import { UploadService } from '../upload/upload.service';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleService } from '../role/role.service';
import { CompanyService } from '../company/company.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  CompanyInformationDto,
  RoleInformationDto,
  UserResponseDto,
} from './dtos/user-response.dto';
import { UserQueryDto } from './dtos/user-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,

    @Inject(HashingProvider)
    private readonly hashingProvider: HashingProvider,

    private readonly uploadService: UploadService,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (await this.existsByEmail(createUserDto.email)) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    const user = this.usersRepository.create({
      email: createUserDto.email.trim(),
      name: createUserDto.name,
      password: hashedPassword,
      address: createUserDto.address,
      gender: createUserDto.gender,
      dob: createUserDto.dob,
    });

    if (createUserDto.roleId) {
      await this.setRole(user, createUserDto.roleId);
    }

    if (createUserDto.company) {
      await this.setCompany(user, createUserDto.company);
    }

    const savedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(savedUser);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['role', 'company'],
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.address !== undefined) {
      user.address = updateUserDto.address;
    }

    if (updateUserDto.gender !== undefined) {
      user.gender = updateUserDto.gender;
    }

    if (updateUserDto.dob !== undefined) {
      user.dob = updateUserDto.dob;
    }

    if (updateUserDto.roleId) {
      await this.setRole(user, updateUserDto.roleId);
    }

    if (updateUserDto.company) {
      await this.setCompany(user, updateUserDto.company);
    }

    if (updateUserDto.password) {
      user.password = await this.hashingProvider.hashPassword(
        updateUserDto.password,
      );
    }
    const savedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(savedUser);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const existsUser = await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'company', 'company.companyLogo'],
    });

    if (existsUser) {
      return true;
    } else {
      return false;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'company', 'company.companyLogo', 'company.owner'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'company', 'company.companyLogo', 'role.permissions'],
    });
  }

  async findAllUsers(
    query: UserQueryDto,
  ): Promise<Paginated<UserResponseDto>> {
    const where: FindOptionsWhere<User> = {};

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }
    if (query.email) {
      where.email = ILike(`%${query.email}%`);
    }
    if (query.gender) {
      where.gender = query.gender;
    }

    const paginated = await this.paginationProvider.paginateQuery(
      query,
      this.usersRepository,
      where,
      {},
      ['role', 'company', 'company.companyLogo'],
    );

    return {
      data: await Promise.all(
        paginated.data.map((user) => this.mapToResponseDto(user)),
      ),
      meta: paginated.meta,
    };
  }

  async updateSelfAvatar(email: string, file: Express.Multer.File) {
    if (!file) return;

    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const result = await this.uploadService.uploadImage(file, 'avatars');

    user.userImgUrl = result.secure_url;

    const updatedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(updatedUser);
  }

  async detachUsersFromRole(roleId: string): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ role: null })
      .where('roleId = :roleId', { roleId })
      .execute();
  }

  private async setCompany(user: User, id: string) {
    const company = await this.companyService.findById(id);
    user.company = company;
  }

  private async setRole(user: User, id: string) {
    const role = await this.roleService.findById(id);
    user.role = role;
  }

  public async mapToResponseDto(user: User): Promise<UserResponseDto> {
    let permissions: string[] = [];

    if (user.role) {
      permissions = await this.roleService.getPermissionByName(user.role.name);
    }
    let company: CompanyInformationDto | null = null;
    if (user.company) {
      company = {
        id: user.company.id,
        name: user.company.name,
        address: user.company.address,
        logoUrl: user.company.companyLogo
          ? user.company.companyLogo.logoUrl
          : '',
      };
    }

    let role: RoleInformationDto | null = null;
    if (user.role) {
      role = {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
      };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      userImgUrl: user.userImgUrl,
      company,
      role,
      permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

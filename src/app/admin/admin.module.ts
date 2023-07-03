import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_SECRET } from 'src/core/environment';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }),    
],
  controllers: [AdminController],
  providers: [ AdminService, JwtStrategy],
  exports: [AdminService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    AccountsModule,  // ✅ This mounts /accounts endpoints
    PrismaModule
  ],
})
export class AppModule {}

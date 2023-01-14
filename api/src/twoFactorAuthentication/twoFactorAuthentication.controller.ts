import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    Get,
    Body,
    HttpCode,
    UnauthorizedException,
    HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { FortyTwoUserDto, TwoFactorAuthenticationCodeDto } from 'src/auth/dto';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import JwtGuard from 'src/common/guards/jwt1.guard';
import JwtTwoFactorGuard from 'src/common/guards/jwt_guard';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@ApiTags('2FA')
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly authService: AuthService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    ) {}

    @Get('generate')
    @UseGuards(JwtTwoFactorGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser) {
        const otpauthUrl =
            await this.twoFactorAuthenticationService.generateTwoFactorAuthSecretKey(
                request.user,
            );

        return this.twoFactorAuthenticationService.pipeQrCodeStream(
            response,
            otpauthUrl,
        );
    }

    // Now, the user can generate a QR code, save it in the Google Authenticator application, and send a valid code to the /2fa/turn-on endpoint. If that’s the case, we acknowledge that the two-factor authentication has been saved.
    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtTwoFactorGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { code }: TwoFactorAuthenticationCodeDto,
    ) {
        //console.log('request.user', request);
        try {
            const isCodeValid =
                await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                    request.user,
                    code,
                );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            await this.authService.enableTwoFactor(request.user);
            const accessTokenCookie = this.authService.getJwtToken(
                request.user,
                true,
            );
            request.res.setHeader('Set-Cookie', [accessTokenCookie]);
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    @Post('turn-off')
    @HttpCode(200)
    @UseGuards(JwtTwoFactorGuard)
    async turnOffTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { code }: TwoFactorAuthenticationCodeDto,
    ) {
        const isCodeValid =
            await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                request.user,
                code,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.disableTwoFactor(request.user);
        const accessTokenCookie = this.authService.getJwtToken(
            request.user,
            false,
        );
        request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    }

    // Logging in with two-factor authentication
    // the user logs in using the email and the password, and we respond with a JWT token,
    // if the 2FA is turned off, we give full access to the user,
    // if the 2FA is turned on, we provide the access just to the /2fa/authenticate endpoint,
    // the user looks up the Authenticator application code and sends it to the /2fa/authenticate endpoint; we respond with a new JWT token with full access.
    // @UseGuards(JwtTwoFactorGuard)
    @Post('authenticate')
    @UseGuards(JwtGuard)
    @HttpCode(200)
    async authenticate(
        @Req() request: RequestWithUser,
        @Body()
        { code }: TwoFactorAuthenticationCodeDto,
    ) {
        const isCodeValid =
            await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                request.user,
                code,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        const accessTokenCookie = this.authService.getCookieWithJwtToken(
            request.user,
            true,
        );
        request.res.setHeader('Set-Cookie', [accessTokenCookie]);
        return request.user;
    }
}

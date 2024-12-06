import { AuthenticationService } from '@iam/authentication/application/service/authentication.service';
import { AppRole } from '@iam/authorization/domain/app-role.enum';
import { UserResponseDto } from '@iam/user/application/dto/user-response.dto';
import { UserService } from '@iam/user/application/service/user.service';

export class AuthenticationProvider {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}
  public getUiProps(): Record<string, any> {
    return {};
  }
  async handleLogin(
    userInputData: Request & { data: { email: string; password: string } },
  ): Promise<null | { user: UserResponseDto; token: string }> {
    try {
      const { email: username, password } = userInputData.data;
      const userTokens = await this.authenticationService.handleSignIn({
        username,
        password,
      });

      if (!userTokens) return null;

      const user = await this.userService.getOneByUsername(username);

      if (user.roles.includes(AppRole.Admin)) {
        return { user, token: userTokens.data.attributes.accessToken };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

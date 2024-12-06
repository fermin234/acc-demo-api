import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

import { ISignInResponse } from '@iam/authentication/application/dto/sign-in-response.interface';
import { AuthenticationService } from '@iam/authentication/application/service/authentication.service';
import { AuthenticationProvider } from '@iam/authentication/infrastructure/admin/admin-authentication.provider';
import { AppRole } from '@iam/authorization/domain/app-role.enum';
import { UserResponseDto } from '@iam/user/application/dto/user-response.dto';
import { UserService } from '@iam/user/application/service/user.service';

describe('AuthenticationProvider', () => {
  let authenticationProvider: AuthenticationProvider;
  let authenticationService: AuthenticationService;
  let userService: UserService;

  beforeEach(() => {
    authenticationService = {
      handleSignIn: jest.fn().mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      }),
    } as unknown as AuthenticationService;

    userService = {
      getOneByUsername: jest.fn().mockResolvedValue({}),
    } as unknown as UserService;

    authenticationProvider = new AuthenticationProvider(
      authenticationService,
      userService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUiProps', () => {
    it('should return an empty object', () => {
      expect(authenticationProvider.getUiProps()).toEqual({});
    });
  });

  describe('handleLogin', () => {
    it('should return null if authentication fails', async () => {
      const requestData = {
        data: { email: 'test@example.com', password: 'password' },
      } as Request & { data: { email: string; password: string } };

      jest.spyOn(authenticationService, 'handleSignIn').mockResolvedValue(null);

      const result = await authenticationProvider.handleLogin(requestData);

      expect(result).toBeNull();
    });

    it('should return the user if authentication succeeds and the user has admin role', async () => {
      const requestData = {
        data: { email: 'test@example.com', password: 'password' },
      } as Request & { data: { email: string; password: string } };

      const user: UserResponseDto = {
        roles: [AppRole.Admin],
      } as UserResponseDto;
      const token = 'mockedAccessToken';

      jest.spyOn(authenticationService, 'handleSignIn').mockResolvedValue({
        data: { attributes: { accessToken: token } },
      } as OneSerializedResponseDto<ISignInResponse>);

      jest.spyOn(userService, 'getOneByUsername').mockResolvedValue(user);

      const result = await authenticationProvider.handleLogin(requestData);
      expect(result).toEqual({ user, token });
    });

    it('should return null if authentication succeeds but the user does not have admin role', async () => {
      const requestData = {
        data: { email: 'test@example.com', password: 'password' },
      } as Request & { data: { email: string; password: string } };

      const user: UserResponseDto = {
        roles: [],
      } as UserResponseDto;

      jest.spyOn(userService, 'getOneByUsername').mockResolvedValue(user);

      const result = await authenticationProvider.handleLogin(requestData);

      expect(result).toBeNull();
    });
  });
});

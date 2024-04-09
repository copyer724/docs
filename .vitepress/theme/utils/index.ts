let user = {
  username: "copyer",
  password: "copyer123",
};

export const successTxt = btoa(`${user.username}${user.password}`);

/**
 * 验证用户名和密码是否正确
 * @param info 用户名和密码
 */
export function validate(info: { username: string; password: string }) {
  return `${info.username}${info.password}` === successTxt;
}

/**
 * 生成 token
 * @param info 用户信息
 * @returns token
 */
export function generateToken(info: { username: string; password: string }) {
  return btoa(`${info.username}${info.password}`);
}

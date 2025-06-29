/* eslint-disable no-undef */
const motion = {
  svg: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  path: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  div: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  span: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
};
module.exports.motion = motion;

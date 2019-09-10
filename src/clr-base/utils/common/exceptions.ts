/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const throwException = (consoleOrError: any) => (consoleMsgType = 'warn') => (message: string) => {
  switch (consoleOrError) {
    case console:
      console[consoleMsgType](message);
      break;
    case Error:
      throw new Error(message);
      break;
    default:
      break;
  }
};

export const throwConsoleException = throwException(window.console);
export const throwConsoleWarning = throwConsoleException('warn');

import { BrowserWindow, screen } from 'electron';
import { __log, __store } from '../global';

export interface Options {
  //  默认高度 600
  defaultHeight?: number;
  // 默认宽度 900
  defaultWidth?: number;
  // 是否全屏状态
  fullScreen?: boolean;
  // 窗口最大
  maximize?: boolean;
  //保存key
  storeKey?: string;
}

export interface WindowState extends State {
  /** Register listeners on the given `BrowserWindow` for events that are related to size or position changes (resize, move). It will also restore the window's maximized or full screen state. When the window is closed we automatically remove the listeners and save the state. */
  manage: (window: Electron.BrowserWindow) => void;
  /** Saves the current state of the given `BrowserWindow`. This exists mostly for legacy purposes, and in most cases it's better to just use `manage()`. */
  saveState: (window: Electron.BrowserWindow) => void;
  /** Removes all listeners of the managed `BrowserWindow` in case it does not need to be managed anymore. */
  unmanage: () => void;
  resetStateToDefault: () => void;
}

export interface State {
  displayBounds: {
    height: number;
    width: number;
  };
  /** The saved height of loaded state. `defaultHeight` if the state has not been saved yet. */
  height: number;
  /** The saved width of loaded state. `defaultWidth` if the state has not been saved yet. */
  width: number;
  /** The saved x coordinate of the loaded state. `undefined` if the state has not been saved yet. */
  x: number;
  /** The saved y coordinate of the loaded state. `undefined` if the state has not been saved yet. */
  y: number;
  /** true if the window state was saved while the window was in full screen mode. `undefined` if the state has not been saved yet. */
  isFullScreen?: boolean;
  /** `true` if the window state was saved while the window was maximized. `undefined` if the state has not been saved yet. */
  isMaximized?: boolean;
}

export default function (options: Options): WindowState {
  let state: State;
  let winRef: BrowserWindow;
  let stateChangeTimer: NodeJS.Timeout;
  const eventHandlingDelay = 100;
  const config: Options = Object.assign(
    {
      storeKey: 'window-state',
      maximize: true,
      fullScreen: true
    },
    options
  );

  function isNormal(win) {
    return !win.isMaximized() && !win.isMinimized() && !win.isFullScreen();
  }

  function hasBounds() {
    return (
      state && Number.isInteger(state.x) && Number.isInteger(state.y) && Number.isInteger(state.width) && state.width > 0 && Number.isInteger(state.height) && state.height > 0
    );
  }

  function resetStateToDefault() {
    const displayBounds = screen.getPrimaryDisplay().bounds;
    // Reset state to default values on the primary display
    state = {
      width: config.defaultWidth || 900,
      height: config.defaultHeight || 600,
      x: 0,
      y: 0,
      displayBounds
    };
  }

  function windowWithinBounds(bounds) {
    return state.x >= bounds.x && state.y >= bounds.y && state.x + state.width <= bounds.x + bounds.width && state.y + state.height <= bounds.y + bounds.height;
  }

  function ensureWindowVisibleOnSomeDisplay() {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(display.bounds);
    });

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetStateToDefault();
    }
  }

  function validateState() {
    const isValid = state && (hasBounds() || state.isMaximized || state.isFullScreen);
    if (!isValid) {
      state = null;
      return;
    }

    if (hasBounds() && state.displayBounds) {
      ensureWindowVisibleOnSomeDisplay();
    }
  }

  function updateState(win?: BrowserWindow) {
    win = win || winRef;
    if (!win) {
      return;
    }
    // Don't throw an error when window was closed
    try {
      const winBounds = win.getBounds();
      if (isNormal(win)) {
        state.x = winBounds.x;
        state.y = winBounds.y;
        state.width = winBounds.width;
        state.height = winBounds.height;
      }
      state.isMaximized = win.isMaximized();
      state.isFullScreen = win.isFullScreen();
      state.displayBounds = screen.getDisplayMatching(winBounds).bounds;
    } catch (err) {
      __log(err);
    }
  }

  function saveState(win?: BrowserWindow) {
    // Update window state only if it was provided
    if (win) {
      updateState(win);
    } else if (winRef) {
      // 不能resize 则不保存
      if (!winRef.isResizable()) {
        return;
      }
    }
    // Save state
    try {
      __store.set(config.storeKey, state);
    } catch (err) {
      // Don't care
    }
  }

  function stateChangeHandler() {
    // Handles both 'resize' and 'move'
    clearTimeout(stateChangeTimer);
    stateChangeTimer = setTimeout(updateState, eventHandlingDelay);
  }

  function closeHandler() {
    updateState();
  }

  function closedHandler() {
    // Unregister listeners and save state
    unmanage();
    saveState();
  }

  function manage(win) {
    if (config.maximize && state.isMaximized) {
      win.maximize();
    }
    if (config.fullScreen && state.isFullScreen) {
      win.setFullScreen(true);
    }
    win.on('resize', stateChangeHandler);
    win.on('move', stateChangeHandler);
    win.on('close', closeHandler);
    win.on('closed', closedHandler);
    winRef = win;
  }

  function unmanage() {
    if (winRef) {
      winRef.removeListener('resize', stateChangeHandler);
      winRef.removeListener('move', stateChangeHandler);
      clearTimeout(stateChangeTimer);
      winRef.removeListener('close', closeHandler);
      winRef.removeListener('closed', closedHandler);
      winRef = null;
    }
  }

  // Load previous state
  try {
    state = __store.get(config.storeKey) as State;
  } catch (err) {
    // Don't care
  }

  // Check state validity
  validateState();

  // Set state fallback values
  state = Object.assign(
    {
      width: config.defaultWidth || 900,
      height: config.defaultHeight || 600
    },
    state
  );

  return {
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get width() {
      return state.width;
    },
    get height() {
      return state.height;
    },
    get displayBounds() {
      return state.displayBounds;
    },
    get isMaximized() {
      return state.isMaximized;
    },
    get isFullScreen() {
      return state.isFullScreen;
    },
    saveState,
    unmanage,
    manage,
    resetStateToDefault
  };
}

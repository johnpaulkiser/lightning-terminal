import { action, autorun, observable, toJS } from 'mobx';
import { BalanceMode, Unit } from 'util/constants';
import { Store } from 'store';

export interface PersistentSettings {
  sidebarVisible: boolean;
  unit: Unit;
  balanceMode: BalanceMode;
  tourAutoShown: boolean;
}

export default class SettingsStore {
  private _store: Store;

  /** determines if the sidebar nav is visible */
  @observable sidebarVisible = true;

  /** determines if the sidebar should collapse automatically for smaller screen widths */
  @observable autoCollapse = false;

  /** determines if the tour was automatically displayed on the first visit */
  @observable tourAutoShown = false;

  /** specifies which denomination to show units in */
  @observable unit: Unit = Unit.sats;

  /** specifies the mode to use to determine channel balance status */
  @observable balanceMode: BalanceMode = BalanceMode.receive;

  /** the chosen language */
  @observable lang = 'en-US';

  constructor(store: Store) {
    this._store = store;
  }

  /**
   * toggle the sidebar to be collapsed or expanded
   */
  @action.bound toggleSidebar() {
    this._store.log.info('toggling sidebar');
    this.sidebarVisible = !this.sidebarVisible;
    this._store.log.info('updated SettingsStore.showSidebar', toJS(this.sidebarVisible));
  }

  /**
   * collapses the sidebar if `autoCollapse` is enabled
   */
  @action.bound autoCollapseSidebar() {
    if (this.autoCollapse && this.sidebarVisible) {
      this.sidebarVisible = false;
    }
  }

  /**
   * sets the unit to display throughout the app
   */
  @action.bound setUnit(unit: Unit) {
    this.unit = unit;
  }

  /**
   * sets the balance mode
   */
  @action.bound setBalanceMode(mode: BalanceMode) {
    this.balanceMode = mode;
  }

  /**
   * initialized the settings and auto-save when a setting is changed
   */
  @action.bound
  init() {
    this.load();
    autorun(
      () => {
        const settings: PersistentSettings = {
          sidebarVisible: this.sidebarVisible,
          unit: this.unit,
          balanceMode: this.balanceMode,
          tourAutoShown: this.tourAutoShown,
        };
        this._store.storage.set('settings', settings);
        this._store.log.info('saved settings to localStorage', settings);
      },
      { name: 'settingsAutorun' },
    );
  }

  /**
   * load settings from the browser's local storage
   */
  @action.bound
  load() {
    this._store.log.info('loading settings from localStorage');
    const settings = this._store.storage.get<PersistentSettings>('settings');
    if (settings) {
      this.sidebarVisible = settings.sidebarVisible;
      this.unit = settings.unit;
      this.balanceMode = settings.balanceMode;
      this.tourAutoShown = settings.tourAutoShown;
      this._store.log.info('loaded settings', settings);
    }

    // enable automatic sidebar collapsing for smaller screens
    if (window.innerWidth && window.innerWidth <= 1200) {
      this.autoCollapse = true;
      this.sidebarVisible = false;
    }
  }
}

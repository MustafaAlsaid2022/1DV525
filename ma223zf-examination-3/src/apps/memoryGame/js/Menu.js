export class Menu {
  constructor () {
    this._menuButton = this.getMenuButton()
    this._modal = this.getModal()
  }

  get menuButton () {
    return this._menuButton
  }

  set menuButton (value) {
    this._menuButton = value
  }

  getMenuButton () {
    return document.getElementById('menuButton')
  }

  getModal () {
    return document.getElementById('menuModal')
  }
}

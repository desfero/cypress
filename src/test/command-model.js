import _ from 'lodash'
import { observable } from 'mobx'
import Log from './log-model'

export default class Command extends Log {
  @observable passed
  @observable selector
  // @observable $el
  @observable highlightAttr
  @observable numElements
  @observable visible = true

  constructor (props) {
    super(props)

    this.passed = props.passed
    this.selector = props.selector
    // this.$el = props.$el
    this.highlightAttr = props.highlightAttr
    this.numElements = props.numElements
    this.visible = props.visible
  }

  update (props) {
    super.update(props)

    this.passed = props.passed
    this.selector = props.selector
    // this.$el = props.$el
    this.highlightAttr = props.highlightAttr
    this.numElements = props.numElements
    this.visible = props.visible
  }

  serialize () {
    return _.extend(super.serialize(), {
      passed: this.passed,
      selector: this.selector,
      // el: this.$el,
      highlightAttr: this.highlightAttr,
      numElements: this.numElements,
      visible: this.visible,
    })
  }
}
